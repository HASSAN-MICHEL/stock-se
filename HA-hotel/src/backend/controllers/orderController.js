import Order from "../models/orders.js";

export const createOrder = async (req, res) => {
  const { menu_id, client_id, montant_total, quantite, type_commande } = req.body;

  // Validation des données
  if (!menu_id || !client_id || !montant_total || !quantite || !type_commande) {
    console.log("Données manquantes:", { menu_id, client_id, montant_total, quantite, type_commande });
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    console.log("Création de la commande avec les données:", { menu_id, client_id, montant_total, quantite, type_commande });

    // Insérer la commande dans la base de données
    const newOrder = await Order.create({
      menu_id,
      client_id,
      montant_total,
      quantite,
      type_commande,
    });

    console.log("Commande créée:", newOrder);

    // Retourner la commande nouvellement créée
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Erreur lors de la création de la commande", error.message);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

// Fonction pour récupérer toutes les commandes de type restaurant
export const getRestaurantOrders = async (req, res) => {
  try {
    // Récupérer les commandes de type restaurant
    const orders = await Order.getCommandesRestaurant();

    // Retourner les commandes
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes restaurant", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes restaurant", error: error.message });
  }
};
