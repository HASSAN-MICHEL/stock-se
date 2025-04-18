import pool from "../config/db.js";

const Client = {
  async getAll() {
    const result = await pool.query("SELECT * FROM clients ORDER BY id ASC");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ nom, email, telephone }) {
    const result = await pool.query(
      "INSERT INTO clients (nom, email, telephone) VALUES ($1, $2, $3) RETURNING *",
      [nom, email, telephone]
    );
    return result.rows[0];
  },

  async update(id, { nom, email, telephone }) {
    const result = await pool.query(
      "UPDATE clients SET nom = $1, email = $2, telephone = $3 WHERE id = $4 RETURNING *",
      [nom, email, telephone, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING *", [id]);
    return result.rows[0]; // Retourne le client supprimé ou null si aucun client n'a été trouvé
  },
};

export default Client; // Exportation du modèle
