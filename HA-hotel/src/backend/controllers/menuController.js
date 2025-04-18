import Menu from "../models/menu.js"; // Assurez-vous que le chemin est correct

const menuController = {
  async getAll(req, res) {
    try {
      const menus = await Menu.getAll();
      res.json(menus);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const menu = await Menu.getById(req.params.id);
      if (!menu) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }
      res.json(menu);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { nom, categorie, prix } = req.body;
      const newMenu = await Menu.create({ nom, categorie, prix });
      res.status(201).json(newMenu);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { nom, categorie, prix } = req.body;
      const updatedMenu = await Menu.update(req.params.id, { nom, categorie, prix });
      if (!updatedMenu) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }
      res.json(updatedMenu);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  async delete(req, res) {
    try {
      const menuId = req.params.id;
      console.log("ID du menu à supprimer :", menuId); // Vérifie si l'ID est bien reçu
      
      const menu = await Menu.getById(menuId);
      if (!menu) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }
  
      const deletedMenu = await Menu.delete(menuId);
      console.log("Menu supprimé :", deletedMenu); // Vérifie si le menu est bien supprimé
  
      res.status(204).send();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.message);
      res.status(500).json({ message: err.message });
    }
  }
  
};  

export const { getAll, create, update } = menuController;
export const deleteMenu = menuController.delete;
