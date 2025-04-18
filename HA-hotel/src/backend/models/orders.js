import pool from "../config/db.js";

const Order = {
  async create({ menu_id, client_id, montant_total, quantite, type_commande }) {
    // Vérification des données avant d'exécuter la requête
    if (!menu_id || !client_id || !montant_total || !quantite || !type_commande) {
      throw new Error("Toutes les informations sont requises.");
    }

    // Vérification des types des données
    if (isNaN(montant_total) || isNaN(quantite)) {
      throw new Error("Montant total et quantité doivent être des nombres.");
    }

    try {
      // Requête pour insérer la commande dans la base de données
      const result = await pool.query(
        "INSERT INTO commandes (menu_id, client_id, montant_total, quantite, type_commande) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [menu_id, client_id, montant_total, quantite, type_commande]
      );
      
      // Retourner la commande insérée
      return result.rows[0];
    } catch (error) {
      console.error("Erreur lors de l'insertion de la commande :", error.message);
      throw new Error(`Erreur lors de l'insertion de la commande: ${error.message}`);
    }
  },

  // Fonction pour récupérer toutes les commandes de type restaurant
  async getCommandesRestaurant() {
    try {
      const result = await pool.query(
        `SELECT * FROM commandes WHERE type_commande = $1`,
        ['restaurant']
      );
      return result.rows;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes restaurant", error.message);
      throw new Error(`Erreur lors de la récupération des commandes restaurant: ${error.message}`);
    }
  }
};

export default Order;
