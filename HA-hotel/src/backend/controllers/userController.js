import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const userController = {
  /**
   * Récupérer tous les utilisateurs (admin uniquement)
   */
  async getAll(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: err.message });
    }
  },

  /**
   * Récupérer un utilisateur par son ID (admin uniquement)
   */
  async getById(req, res) {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err.message });
    }
  },

  /**
   * Connexion de l'utilisateur
   */
  async login(req, res) {
    const { email, mot_de_passe } = req.body;

    try {
      // Authentifier l'utilisateur et générer un token
      const { token, user } = await User.login(email, mot_de_passe);

      // Retourner le token et les informations de l'utilisateur
      res.json({
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (err) {
      console.error("Erreur de connexion :", err);
      res.status(401).json({ message: err.message || "Email ou mot de passe incorrect" });
    }
  },

  /**
   * Middleware pour vérifier le rôle de l'utilisateur
   */
  checkRole(requiredRole) {
    return (req, res, next) => {
      const { role } = req.user; // req.user est défini par le middleware d'authentification

      if (!role) {
        return res.status(401).json({ message: "Non autorisé. Utilisateur non connecté." });
      }

      if (role !== requiredRole) {
        return res.status(403).json({ message: "Accès refusé. Rôle insuffisant." });
      }

      next(); // Autoriser l'accès
    };
  },

  /**
   * Créer un nouvel utilisateur (admin uniquement)
   */
  async create(req, res) {
    try {
      const { nom, email, mot_de_passe, role } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
      }

      // Créer l'utilisateur
      const newUser = await User.create({ nom, email, mot_de_passe, role });

      res.status(201).json({
        message: "Utilisateur créé avec succès !",
        user: newUser,
      });
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur :", err);
      res.status(500).json({ message: err.message || "Erreur lors de la création de l'utilisateur" });
    }
  },

  /**
   * Mettre à jour un utilisateur (admin uniquement)
   */
  async update(req, res) {
    try {
      const { nom, email, role } = req.body;

      const updatedUser = await User.update(req.params.id, { nom, email, role });

      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({
        message: "Utilisateur mis à jour avec succès !",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: err.message });
    }
  },

  /**
   * Mettre à jour le mot de passe d'un utilisateur (utilisateur lui-même ou admin)
   */
  async updatePassword(req, res) {
    try {
      const { newPassword } = req.body;

      const updatedUser = await User.updatePassword(req.params.id, newPassword);

      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({
        message: "Mot de passe mis à jour avec succès !",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe", error: err.message });
    }
  },

  /**
   * Supprimer un utilisateur (admin uniquement)
   */
  async delete(req, res) {
    try {
      const userId = req.params.id;
      console.log("ID de l'utilisateur à supprimer :", userId);

      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await User.delete(userId);
      console.log("Utilisateur supprimé :", userId);

      res.status(204).json({ message: "Utilisateur supprimé avec succès !" });
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: err.message });
    }
  },
};

export const { getAll, getById, create, update, updatePassword, login, checkRole } = userController;
export const deleteUser = userController.delete;