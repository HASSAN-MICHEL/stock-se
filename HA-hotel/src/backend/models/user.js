import pool from "../config/db.js";
import bcrypt from "bcrypt"; // Pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // Pour générer des tokens JWT
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const User = {
  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Les données de l'utilisateur (nom, email, mot_de_passe, role)
   * @returns {Object} - L'utilisateur créé
   */
  async create({ nom, email, mot_de_passe, role }) {
    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10); // 10 est le coût du hachage

    const result = await pool.query(
      `INSERT INTO users (nom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, email, hashedPassword, role]
    );
    return result.rows[0];
  },

  /**
   * Récupérer tous les utilisateurs
   * @returns {Array} - Liste de tous les utilisateurs
   */
  async getAll() {
    const result = await pool.query("SELECT id, nom, email, role, date_creation FROM users");
    return result.rows;
  },

  /**
   * Récupérer un utilisateur par son ID
   * @param {number} id - L'ID de l'utilisateur
   * @returns {Object} - L'utilisateur trouvé
   */
  async getById(id) {
    const result = await pool.query(
      "SELECT id, nom, email, role, date_creation FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  /**
   * Récupérer un utilisateur par son email (pour l'authentification)
   * @param {string} email - L'email de l'utilisateur
   * @returns {Object} - L'utilisateur trouvé
   */
  async getByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  /**
   * Mettre à jour un utilisateur
   * @param {number} id - L'ID de l'utilisateur
   * @param {Object} userData - Les nouvelles données de l'utilisateur (nom, email, role)
   * @returns {Object} - L'utilisateur mis à jour
   */
  async update(id, { nom, email, role }) {
    const result = await pool.query(
      `UPDATE users
       SET nom = $1, email = $2, role = $3
       WHERE id = $4 RETURNING *`,
      [nom, email, role, id]
    );
    return result.rows[0];
  },

  /**
   * Mettre à jour le mot de passe d'un utilisateur
   * @param {number} id - L'ID de l'utilisateur
   * @param {string} newPassword - Le nouveau mot de passe
   * @returns {Object} - L'utilisateur mis à jour
   */
  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      `UPDATE users
       SET mot_de_passe = $1
       WHERE id = $2 RETURNING *`,
      [hashedPassword, id]
    );
    return result.rows[0];
  },

  /**
   * Supprimer un utilisateur
   * @param {number} id - L'ID de l'utilisateur
   * @returns {Object} - L'utilisateur supprimé
   */
  async delete(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  },

  /**
   * Vérifier le mot de passe (pour l'authentification)
   * @param {string} email - L'email de l'utilisateur
   * @param {string} password - Le mot de passe à vérifier
   * @returns {Object} - L'utilisateur si le mot de passe est correct
   * @throws {Error} - Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
   */
  async verifyPassword(email, password) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    if (!isMatch) {
      throw new Error("Mot de passe incorrect");
    }
    return user;
  },

  /**
   * Générer un token JWT pour l'utilisateur
   * @param {Object} user - Les informations de l'utilisateur
   * @returns {string} - Le token JWT
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role }, // Données à inclure dans le token
      process.env.JWT_SECRET, // Utilise la clé secrète définie dans .env
      { expiresIn: "1h" } // Durée de validité du token
    );
  },

  /**
   * Authentifier un utilisateur et retourner un token JWT
   * @param {string} email - L'email de l'utilisateur
   * @param {string} password - Le mot de passe de l'utilisateur
   * @returns {Object} - Le token JWT et les informations de l'utilisateur
   * @throws {Error} - Si l'authentification échoue
   */
  async login(email, password) {
    // Vérifier l'email et le mot de passe
    const user = await this.verifyPassword(email, password);

    // Générer un token JWT
    const token = this.generateToken(user);

    // Retourner le token et les informations de l'utilisateur
    return {
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  },
};

export default User;