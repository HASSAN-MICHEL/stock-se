
import express from "express";
import { getAll, create, update, deleteMenu } from "../controllers/menuController.js";  // Importation des fonctions

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteMenu);  // Définir correctement la route de suppression

export default router;
