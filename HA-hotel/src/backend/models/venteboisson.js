import pool from "../config/db.js";

const VenteBoisson = {
  async getAll() {
    const result = await pool.query("SELECT * FROM ventes_boissons");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM ventes_boissons WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ client_id, boisson_id, quantite }) {
    // Récupérer le prix de la boisson
    const boissonResult = await pool.query("SELECT prix, stock FROM boissons WHERE id = $1", [boisson_id]);
    const boisson = boissonResult.rows[0];

    if (!boisson || boisson.stock < quantite) {
      throw new Error("Boisson non disponible ou stock insuffisant.");
    }

    const montant_total =  (boisson.prix / boisson.stock ) * quantite;

    // Insérer la vente
    const venteResult = await pool.query(
      "INSERT INTO ventes_boissons (client_id, boisson_id, quantite, montant_total) VALUES ($1, $2, $3, $4) RETURNING *",
      [client_id, boisson_id, quantite, montant_total]
    );

    // Mettre à jour le stock de la boisson
    await pool.query(
      "UPDATE boissons SET stock = stock - $1 WHERE id = $2",
      [quantite, boisson_id]
    );
 // Recalculer le prix unitaire en fonction du nouveau stock
 const nouveauStock = boisson.stock - quantite;
 const nouveauPrixUnitaire = (boisson.prix / boisson.stock) * nouveauStock;

 // Mettre à jour le prix de la boisson dans la base de données
 await pool.query(
   "UPDATE boissons SET prix = $1 WHERE id = $2",
   [nouveauPrixUnitaire, boisson_id]
 );

  
    // Générer la facture
    const vente = venteResult.rows[0];
    const factureResult = await pool.query(
      "INSERT INTO factures (client_id, vente_boisson_id, montant_total) VALUES ($1, $2, $3) RETURNING *",
      [client_id, vente.id, montant_total]
    );

    return { vente, facture: factureResult.rows[0] };
  },

  async delete(id) {
    // Supprimer la vente et sa facture associée
    const vente = await pool.query("DELETE FROM ventes_boissons WHERE id = $1 RETURNING *", [id]);
    await pool.query("DELETE FROM factures WHERE vente_boisson_id = $1", [id]);
    return vente.rows[0];
  },

  async getDailyReport(date) {
    const result = await pool.query(
      `SELECT DATE(date_vente) AS jour, SUM(montant_total) AS total_ventes
       FROM ventes_boissons
       WHERE DATE(date_vente) = $1
       GROUP BY DATE(date_vente)`,
      [date]
    );
    return result.rows[0];
  },
  async getMostSoldByMonth(month, year) {
    const result = await pool.query(
      `SELECT b.nom, b.prix, SUM(vb.quantite) AS total_ventes
       FROM ventes_boissons vb
       JOIN boissons b ON vb.boisson_id = b.id
       WHERE EXTRACT(MONTH FROM vb.date_vente) = $1 AND EXTRACT(YEAR FROM vb.date_vente) = $2
       GROUP BY b.nom, b.prix
       ORDER BY total_ventes DESC
       LIMIT 5`,
      [month, year]
    );
    return result.rows;
  },

  async getSalesByProduct(month, year) {
    const result = await pool.query(
      `SELECT b.nom, SUM(vb.quantite) AS total_ventes, SUM(vb.quantite * b.prix) AS prix_total
       FROM ventes_boissons vb
       JOIN boissons b ON vb.boisson_id = b.id
       WHERE EXTRACT(MONTH FROM vb.date_vente) = $1 AND EXTRACT(YEAR FROM vb.date_vente) = $2
       GROUP BY b.nom
       ORDER BY total_ventes DESC`,
      [month, year]
    );
    return result.rows;
  },
  async getMonthlySalesEvolution(year) {
    const result = await pool.query(
      `SELECT EXTRACT(MONTH FROM date_vente) AS month, SUM(montant_total) AS total
       FROM ventes_boissons
       WHERE EXTRACT(YEAR FROM date_vente) = $1
       GROUP BY month
       ORDER BY month`,
      [year]
    );
    return result.rows;
  },

  async getMonthlyReport(year, month) {
    const result = await pool.query(
      `SELECT DATE_TRUNC('month', date_vente) AS mois, SUM(montant_total) AS total_ventes
       FROM ventes_boissons
       WHERE EXTRACT(YEAR FROM date_vente) = $1 AND EXTRACT(MONTH FROM date_vente) = $2
       GROUP BY DATE_TRUNC('month', date_vente)`,
      [year, month]
    );
    return result.rows[0];
  }
};

export default VenteBoisson;




