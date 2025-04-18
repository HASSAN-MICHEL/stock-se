// controllers/chambreController.js
import Chambre from "../models/chambre.js";  // Importation du modèle Chambre

const chambreController = {
  async getAll(req, res) {
    try {
      const chambres = await Chambre.getAll();
      res.json(chambres);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const chambre = await Chambre.getById(req.params.id);
      if (!chambre) {
        return res.status(404).json({ message: "Chambre non trouvée" });
      }
      res.json(chambre);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { numero, type, prix, statut } = req.body;
      const newChambre = await Chambre.create({ numero, type, prix, statut });
      res.status(201).json(newChambre);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { numero, type, prix, statut } = req.body;
      const updatedChambre = await Chambre.update(req.params.id, { numero, type, prix, statut });
      if (!updatedChambre) {
        return res.status(404).json({ message: "Chambre non trouvée" });
      }
      res.json(updatedChambre);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Chambre.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default chambreController;  // Exportation du contrôleur
