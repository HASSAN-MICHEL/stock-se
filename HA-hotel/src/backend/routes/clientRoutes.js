import express from "express";
import { getAll, create, update, deleteClient } from "../controllers/clientController.js";  // Importation des fonctions

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteClient);  // Définir correctement la route de suppression

export default router;
