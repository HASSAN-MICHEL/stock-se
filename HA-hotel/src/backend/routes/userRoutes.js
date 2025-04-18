import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  updatePassword,
  login,
  deleteUser,
  checkRole,
} from "../controllers/userController.js"; // Importation des fonctions du contrôleur
import { authenticate } from "./authMiddleware.js"; // Middleware d'authentification

const router = express.Router();

// Route pour l'authentification (login) - Pas besoin d'authentification pour se connecter
router.post("/login", login);

// Routes protégées par authentification
router.use(authenticate); // Applique le middleware d'authentification à toutes les routes suivantes

// Route pour récupérer tous les utilisateurs (admin uniquement)
router.get("/", checkRole("admin"), getAll);

// Route pour récupérer un utilisateur par son ID (admin uniquement)
router.get("/:id", checkRole("admin"), getById);

// Route pour créer un nouvel utilisateur (admin uniquement)
router.post("/", checkRole("admin"), create);

// Route pour mettre à jour les informations d'un utilisateur (admin uniquement)
router.put("/:id", checkRole("admin"), update);

// Route pour mettre à jour le mot de passe d'un utilisateur (utilisateur lui-même ou admin)
router.put("/:id/password", updatePassword);

// Route pour supprimer un utilisateur (admin uniquement)
router.delete("/:id", checkRole("admin"), deleteUser);

export default router;