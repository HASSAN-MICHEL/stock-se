import Boissons from "../models/boisson.js";  // Importation du modèle Boissons

const boissonController = {
  async getAll(req, res) {
    try {
      const boissons = await Boissons.getAll();
      res.json(boissons);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const boisson = await Boissons.getById(req.params.id);
      if (!boisson) {
        return res.status(404).json({ message: "Boisson non trouvée" });
      }
      res.json(boisson);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { nom, prix, stock } = req.body;
      if (!nom || !prix || stock === undefined) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const newBoisson = await Boissons.create({ nom, prix, stock });
      res.status(201).json(newBoisson);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { nom, prix, stock } = req.body;
      const updatedBoisson = await Boissons.update(req.params.id, { nom, prix, stock });

      if (!updatedBoisson) {
        return res.status(404).json({ message: "Boisson non trouvée" });
      }

      res.json(updatedBoisson);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deletedBoisson = await Boissons.delete(req.params.id);
      if (!deletedBoisson) {
        return res.status(404).json({ message: "Boisson non trouvée" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default boissonController;  // Exportation du contrôleur
