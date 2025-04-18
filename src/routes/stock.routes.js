import express from "express";
import { createStock, getStockByProductId } from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/stocks", createStock); // Création de stock
router.get("/stocks/:product_id", getStockByProductId); // Récupérer le stock d'un produit

export default router;
