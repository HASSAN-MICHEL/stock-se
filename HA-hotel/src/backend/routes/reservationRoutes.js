import express from "express";
import { getAll, getById, create, update, deleteReservation, checkAndUpdateChambreStatus } from "../controllers/reservationController.js";  

const router = express.Router();

// Récupérer toutes les réservations
router.get("/", getAll);

// Récupérer une réservation par son ID
router.get("/:id", getById);

// Créer une nouvelle réservation
router.post("/", create);

// Mettre à jour une réservation existante
router.put("/:id", update);

// Supprimer une réservation
router.delete("/:id", deleteReservation);

// Vérifier et mettre à jour le statut des chambres et des réservations
router.post("/check-status", checkAndUpdateChambreStatus);

export default router;