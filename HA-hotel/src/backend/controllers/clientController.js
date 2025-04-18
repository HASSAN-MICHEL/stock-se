import Client from "../models/client.js"; // Assurez-vous que le chemin est correct

const clientController = {
  async getAll(req, res) {
    try {
      const clients = await Client.getAll();
      res.json(clients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const client = await Client.getById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      res.json(client);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { nom, email, telephone } = req.body;
      if (!nom || !email || !telephone) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
      }

      const newClient = await Client.create({ nom, email, telephone });
      res.status(201).json(newClient);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { nom, email, telephone } = req.body;
      const updatedClient = await Client.update(req.params.id, { nom, email, telephone });

      if (!updatedClient) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      res.json(updatedClient);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const clientId = req.params.id;
      console.log("ID du client à supprimer :", clientId); // Vérifie si l'ID est bien reçu
      
      const client = await Client.getById(clientId);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
  
      const deletedClient = await Client.delete(clientId);
      console.log("Client supprimé :", deletedClient); // Vérifie si le client est bien supprimé
  
      res.status(204).send();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.message);
      res.status(500).json({ message: err.message });
    }
  }
};  

export const { getAll, create, update } = clientController;
export const deleteClient = clientController.delete;
