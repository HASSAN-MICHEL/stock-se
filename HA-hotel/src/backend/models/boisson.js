import pool from "../config/db.js";

const Boissons = {
  async getAll() {
    const result = await pool.query("SELECT * FROM boissons ORDER BY id ASC");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM boissons WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ nom, prix, stock }) {
    const result = await pool.query(
      "INSERT INTO boissons (nom, prix, stock) VALUES ($1, $2, $3) RETURNING *",
      [nom, prix, stock]
    );
    return result.rows[0];
  },

  async update(id, { nom, prix, stock }) {
    const result = await pool.query(
      "UPDATE boissons SET nom = $1, prix = $2, stock = $3 WHERE id = $4 RETURNING *",
      [nom, prix, stock, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM boissons WHERE id = $1 RETURNING *", [id]);
    return result.rows[0]; // Retourne la boisson supprimée ou null si aucune boisson n'a été trouvée
  },
};

export default Boissons;
