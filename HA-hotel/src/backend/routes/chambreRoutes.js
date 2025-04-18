// routes/chambreRoutes.js
import express from "express";
import chambreController from "../controllers/chambreController.js";

const router = express.Router();

// Route pour récupérer toutes les chambres
router.get("/", chambreController.getAll);

// Route pour récupérer une chambre par ID
router.get("/:id", chambreController.getById);

// Route pour ajouter une nouvelle chambre
router.post("/", chambreController.create);

// Route pour mettre à jour une chambre
router.put("/:id", chambreController.update);

// Route pour supprimer une chambre
router.delete("/:id", chambreController.delete);

export default router;
