import VenteBoisson from "../models/venteboisson.js";

const venteBoissonController = {
  async getAll(req, res) {
    try {
      const ventes = await VenteBoisson.getAll();
      res.json(ventes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const vente = await VenteBoisson.getById(req.params.id);
      if (!vente) {
        return res.status(404).json({ message: "Vente non trouvée" });
      }
      res.json(vente);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { client_id, boisson_id, quantite } = req.body;
      const result = await VenteBoisson.create({ client_id, boisson_id, quantite });
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deletedVente = await VenteBoisson.delete(req.params.id);
      if (!deletedVente) {
        return res.status(404).json({ message: "Vente non trouvée" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getDailyReport(req, res) {
    try {
      const { date } = req.params; // La date est passée en paramètre dans l'URL
      const dailyReport = await VenteBoisson.getDailyReport(date);
      if (!dailyReport) {
        return res.status(404).json({ message: "Aucune vente trouvée pour cette date" });
      }
      res.json(dailyReport);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  
  async getMostSoldByMonth(req, res) {
    try {
      const { month, year } = req.params;

      // Validation du mois et de l'année
      if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Mois ou année invalide." });
      }

      const mostSold = await VenteBoisson.getMostSoldByMonth(month, year);
      res.json(mostSold);
    } catch (err) {
      console.error("Erreur lors de la récupération des boissons les plus vendues :", err.message);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des boissons les plus vendues." });
    }
  },

  async getMonthlySalesEvolution(req, res) {
    try {
      const { year } = req.params;

      // Validation de l'année
      if (!year || isNaN(year)) {
        return res.status(400).json({ message: "Année invalide." });
      }

      const salesEvolution = await VenteBoisson.getMonthlySalesEvolution(year);
      res.json(salesEvolution);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'évolution mensuelle des ventes :", err.message);
      res.status(500).json({ message: "Erreur serveur lors de la récupération de l'évolution mensuelle des ventes." });
    }
  },

  async getSalesByProduct(req, res) {
    try {
      const { month, year } = req.params;
  
      // Validation du mois et de l'année
      if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Mois ou année invalide." });
      }
  
      const salesByProduct = await VenteBoisson.getSalesByProduct(month, year);
      res.json(salesByProduct);
    } catch (err) {
      console.error("Erreur lors de la récupération des ventes par produit :", err.message);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des ventes par produit." });
    }
  },
  
  async getMonthlyReport(req, res) {
    try {
      const { year, month } = req.params; // L'année et le mois sont passés en paramètres dans l'URL
      const monthlyReport = await VenteBoisson.getMonthlyReport(year, month);
      if (!monthlyReport) {
        return res.status(404).json({ message: "Aucune vente trouvée pour ce mois" });
      }
      res.json(monthlyReport);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default venteBoissonController;