
import Stock from '../models/stock.js';
import StockHistory from "../models/StockHistory.js";
import axios from "axios";
import { Parser } from "json2csv";

const PRODUCT_SERVICE_URL = "http://localhost:5000/api/products";

const StockController = {
    getStock: async (req, res) => {
        try {
          const stocks = await Stock.findAll();
          const stocksWithNames = await Promise.all(
            stocks.map(async (stock) => {
              // Récupérer le nom du produit via l'ID produit
              const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${stock.product_id}`);
              const productName = productResponse.data.name;  // Assurez-vous que la réponse contient le champ `name`
              
              return {
                ...stock.dataValues,
                product_name: productName,  // Ajouter le nom du produit à la réponse
              };
            })
          );
          res.json(stocksWithNames);  // Renvoie les stocks avec le nom des produits
        } catch (err) {
          console.error("Erreur lors de la récupération des stocks :", err);
          res.status(500).json({ message: "Erreur interne lors de la récupération des stocks." });
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
