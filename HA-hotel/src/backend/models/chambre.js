import pool from "../config/db.js"; // ✅ Utilisation de import


const Chambre = {
  async getAll() {
    const result = await pool.query("SELECT * FROM chambres");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM chambres WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ numero, type, prix, statut }) {
    const result = await pool.query(
      "INSERT INTO chambres (numero, type, prix, statut) VALUES ($1, $2, $3, $4) RETURNING *",
      [numero, type, prix, statut]
    );
    return result.rows[0];  // Assurez-vous que la chambre est bien retournée après l'ajout
  },

  async update(id, { numero, type, prix, statut }) {
    const result = await pool.query(
      "UPDATE chambres SET numero = $1, type = $2, prix = $3, statut = $4 WHERE id = $5 RETURNING *",
      [numero, type, prix, statut, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM chambres WHERE id = $1", [id]);
  },
};

export default Chambre; // ✅ Utilisation de `export default`
