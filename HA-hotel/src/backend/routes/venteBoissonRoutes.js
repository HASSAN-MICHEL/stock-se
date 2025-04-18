import express from "express";
import venteBoissonController from "../controllers/venteBoissonController.js";

const router = express.Router();

// Routes existantes
router.get("/", venteBoissonController.getAll);
router.get("/:id", venteBoissonController.getById);
router.post("/", venteBoissonController.create);
router.delete("/:id", venteBoissonController.delete);

// Nouvelle route pour le rapport journalier
router.get("/rapports/journalier/:date", venteBoissonController.getDailyReport);

// Nouvelle route pour le rapport mensuel
router.get("/rapports/mensuel/:year/:month", venteBoissonController.getMonthlyReport);
router.get("/boissons-plus-vendues/:month/:year", venteBoissonController.getMostSoldByMonth);
router.get("/evolution-ventes/:year", venteBoissonController.getMonthlySalesEvolution);
// Nouvelle route pour les ventes par produit
router.get("/ventes-par-produit/:month/:year", venteBoissonController.getSalesByProduct);


export default router;