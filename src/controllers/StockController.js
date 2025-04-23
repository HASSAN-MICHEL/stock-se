
import Stock from '../models/stock.js';
import StockHistory from "../models/StockHistory.js";
import axios from "axios";
import { Parser } from "json2csv";
import { Op, Sequelize } from 'sequelize';


const PRODUCT_SERVICE_URL = "http://localhost:5000/api/products";

const StockController = {
  getStock: async (req, res) => {
    try {
      console.log("Fetching all stocks...");  // Ajout pour debug
      const stocks = await Stock.findAll();
      
      const stocksWithNames = await Promise.all(
        stocks.map(async (stock) => {
          try {
            const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${stock.product_id}`);
            return {
              ...stock.dataValues,
              product_name: productResponse.data.name,
            };
          } catch (e) {
            console.error(`Erreur produit ${stock.product_id}:`, e.message);
            return {
              ...stock.dataValues,
              product_name: `Produit ${stock.product_id} (nom indisponible)`,
            };
          }
        })
      );
      
      console.log("Stocks to return:", stocksWithNames);  // Ajout pour debug
      res.json(stocksWithNames);
      
    } catch (err) {
      console.error("Erreur getStock:", err);
      res.status(500).json({ 
        message: "Erreur serveur",
        details: err.message 
      });
    }
},

  updateStock: async (req, res) => {
    const { product_id } = req.params;
    const { quantity_available, stock_threshold } = req.body;
    const stock = await Stock.findOne({ where: { product_id } });
    if (!stock) return res.status(404).json({ message: "Stock introuvable." });
    stock.quantity_available = quantity_available;
    stock.stock_threshold = stock_threshold;
    await stock.save();
    res.json(stock);
  },

  stockEntry: async (req, res) => {
    const { product_id, quantity } = req.body;
    let stock = await Stock.findOne({ where: { product_id } });

    if (!stock) {
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/${product_id}`);
        if (!response.data) return res.status(404).json({ message: "Produit introuvable." });

        stock = await Stock.create({
          product_id,
          quantity_available: quantity,
        });
      } catch (e) {
        return res.status(404).json({ message: "Produit introuvable dans le service produits." });
      }
    } else {
      stock.quantity_available += quantity;
      await stock.save();
    }

    await StockHistory.create({ product_id, action: "entry", quantity });
    res.json({ message: "Entrée en stock enregistrée", stock });
  },

  getStockByProductId: async (req, res) => {
    const { product_id } = req.params;
    try {
      const stock = await Stock.findOne({ where: { product_id } });
      
      if (!stock) {
        // Retourner un stock à 0 si non trouvé plutôt qu'une erreur
        return res.json({ 
          product_id,
          quantity_available: 0,
          stock_threshold: 0
        });
      }
      
      res.json(stock);
    } catch (err) {
      console.error("Erreur récupération stock:", err);
      res.status(500).json({ 
        message: "Erreur serveur",
        error: err.message 
      });
    }
  },

  // Nouvelle méthode pour les statistiques de mouvements par période
getMovementsStats: async (req, res) => {
  try {
      const { period = 'day' } = req.query;
      
      const stats = await StockHistory.findAll({
          attributes: [
              'action',
              [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
              [sequelize.fn('COUNT', sequelize.col('id')), 'count_operations'],
              [sequelize.fn('DATE', sequelize.col('date')), 'date']
          ],
          where: {
              date: {
                  [Op.gte]: sequelize.literal(`DATE('now', 'start of ${period}')`)
              }
          },
          group: ['action', 'date']
      });
      
      res.json(stats);
  } catch (err) {
      console.error("Erreur stats mouvements:", err);
      res.status(500).json({ message: "Erreur serveur" });
  }
},

// Nouvelle méthode pour les mouvements récents
getRecentMovements: async (req, res) => {
  try {
      const { limit = 4 } = req.query;
      
      const movements = await StockHistory.findAll({
          order: [['date', 'DESC']],
          limit: parseInt(limit)
      });
      
      res.json(movements);
  } catch (err) {
      console.error("Erreur mouvements récents:", err);
      res.status(500).json({ message: "Erreur serveur" });
  }
},

  stockExit: async (req, res) => {
    const { product_id, quantity } = req.body;
    const stock = await Stock.findOne({ where: { product_id } });
    if (!stock || stock.quantity_available < quantity)
      return res.status(400).json({ message: "Stock insuffisant." });

    stock.quantity_available -= quantity;
    await stock.save();
    await StockHistory.create({ product_id, action: "exit", quantity });
    res.json({ message: "Sortie de stock enregistrée", stock });
  },

  stockAlerts: async (req, res) => {
    const lowStocks = await Stock.findAll({
      where: {
        quantity_available: {
          [Op.lt]: Sequelize.col("stock_threshold"),
        },
      },
    });
    res.json(lowStocks);
  },

  
  getFullProductHistory: async (req, res) => {
      try {
          const { product_id } = req.params;
          
          const history = await StockHistory.findAll({
              where: { product_id },
              order: [['date', 'DESC']]
          });
          
          res.json(history);
      } catch (err) {
          console.error("Erreur historique produit:", err);
          res.status(500).json({ message: "Erreur serveur" });
      }
  },

  /**
   * Nouvelle méthode - Mouvements récents (formatté pour l'affichage)
   */
  getFormattedMovements: async (req, res) => {
      try {
          const { limit = 100 } = req.query;
          
          const movements = await StockHistory.findAll({
              order: [['date', 'DESC']],
              limit: parseInt(limit)
          });
          
          // Formatage simple pour affichage
          const formatted = movements.map(m => ({
              id: m.id,
              product_id: m.product_id,
              type: m.action === 'entry' ? 'Entrée' : 'Sortie',
              quantity: m.quantity,
              date: m.date.toISOString().split('T')[0] // Format YYYY-MM-DD
          }));
          
          res.json(formatted);
      } catch (err) {
          console.error("Erreur mouvements:", err);
          res.status(500).json({ message: "Erreur serveur" });
      }
  },

  getBasicStats: async (req, res) => {
      try {
          const entryStats = await StockHistory.sum('quantity', {
              where: { action: 'entry' }
          });
          
          const exitStats = await StockHistory.sum('quantity', {
              where: { action: 'exit' }
          });
          
          res.json({
              total_entries: entryStats || 0,
              total_exits: exitStats || 0,
              balance: (entryStats || 0) - (exitStats || 0)
          });
      } catch (err) {
          console.error("Erreur statistiques:", err);
          res.status(500).json({ message: "Erreur serveur" });
      }
  },


  exportHistory: async (req, res) => {
    const { month } = req.query;
    const histories = await StockHistory.findAll();
    const data = histories.map(h => ({
      product_id: h.product_id,
      action: h.action,
      quantity: h.quantity,
      date: h.date,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment(`historique-stock-${month || "tous"}.csv`);
    return res.send(csv);
  }
};

export default StockController;
