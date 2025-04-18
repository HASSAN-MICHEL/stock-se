import pool from "../config/db.js";
// Exemple dans models/menu.


const Menu = {
  async getAll() {
    const result = await pool.query("SELECT * FROM menus");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM menus WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ nom, categorie, prix }) {
    const result = await pool.query(
      "INSERT INTO menus (nom, categorie, prix) VALUES ($1, $2, $3) RETURNING *",
      [nom, categorie, prix]
    );
    return result.rows[0];
  },

  async update(id, { nom, categorie, prix }) {
    const result = await pool.query(
      "UPDATE menus SET nom = $1, categorie = $2, prix = $3 WHERE id = $4 RETURNING *",
      [nom, categorie, prix, id]
    );
    return result.rows[0];
  },
  async delete(id) {
    const result = await pool.query("DELETE FROM menus WHERE id = $1 RETURNING *", [id]);
    return result.rows[0]; // Retourne le menu supprimé ou null si aucun menu n'a été trouvé
  },
  
};

export default  Menu; // Exportation du modèle
