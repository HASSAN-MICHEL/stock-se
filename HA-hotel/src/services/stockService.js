import axios from 'axios';

// URLs des microservices
const STOCK_API_URL = 'http://localhost:5001/api';  // Microservice Stock
const PRODUIT_API_URL = 'http://localhost:5000/api';  // Microservice Produits

// Récupérer tous les produits
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${PRODUIT_API_URL}/produits`);
    return response.data; // On renvoie directement la réponse
  } catch (error) {
    console.error("Erreur lors de la récupération des produits", error);
    throw error;  // Lancer l'erreur pour qu'elle soit gérée dans le composant appelant
  }
};

// Ajouter un stock initial pour un produit
export const createStock = async (produitId, quantite, seuil) => {
  try {
    const response = await axios.post(`${STOCK_API_URL}/stock/${produitId}`, { 
      qty: quantite,
      threshold: seuil,  // On envoie aussi le seuil de stock
    });
    return response.data;  // Retourner la réponse du backend
  } catch (error) {
    console.error("Erreur lors de l'ajout du stock initial", error);
    throw error;  // Lancer l'erreur pour qu'elle soit gérée dans le composant appelant
  }
};

// Récupérer le stock d'un produit donné
export const getStockByProductId = async (produitId) => {
  try {
    const response = await axios.get(`${STOCK_API_URL}/stock/${produitId}`);
    return response.data;  // Retourner les données du stock
  } catch (error) {
    console.error("Erreur lors de la récupération du stock", error);
    throw error;  // Lancer l'erreur pour qu'elle soit gérée dans le composant appelant
  }
};

// Mettre à jour la quantité du stock d'un produit
export const updateStock = async (produitId, quantite) => {
  try {
    const response = await axios.put(`${STOCK_API_URL}/stock/${produitId}`, { 
      qty: quantite  // Envoi de la nouvelle quantité
    });
    return response.data;  // Retourner les données du stock mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock", error);
    throw error;  // Lancer l'erreur pour qu'elle soit gérée dans le composant appelant
  }
};

// Récupérer les alertes de stock faible
export const getStockAlerts = async () => {
  try {
    const response = await axios.get(`${STOCK_API_URL}/stock/alertes`);
    return response.data;  // Retourner les alertes de stock faible
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes de stock", error);
    throw error;  // Lancer l'erreur pour qu'elle soit gérée dans le composant appelant
  }
};
