import express from "express";
import boissonController from "../controllers/boissonController.js";  // Importation du contrôleur

const router = express.Router();

router.get("/", boissonController.getAll);
router.get("/:id", boissonController.getById);
router.post("/", boissonController.create);
router.put("/:id", boissonController.update);
router.delete("/:id", boissonController.delete);  // Route pour la suppression d'une boisson

export default router;
