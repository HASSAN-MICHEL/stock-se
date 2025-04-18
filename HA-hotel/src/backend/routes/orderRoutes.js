import express from "express";
import { createOrder, getRestaurantOrders } from "../controllers/orderController.js"; // Assure-toi que le chemin est correct

const router = express.Router();

// Route POST pour créer une commande
router.post("/", createOrder); // Pour créer une nouvelle commande

// Route GET pour récupérer toutes les commandes de type 'restaurant'
router.get("/restaurant", getRestaurantOrders); // Pour récupérer toutes les commandes de type restaurant

export default router;
