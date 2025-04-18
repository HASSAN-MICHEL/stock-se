

import pool from "../config/db.js";

const Reservation = {
  async getAll() {
    const result = await pool.query("SELECT * FROM reservations");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM reservations WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ client_id, chambre_id, date_debut, date_fin, statut, montant_total }) {
    try {
      // Vérifier si la chambre est disponible
      const chambreResult = await pool.query(
        "SELECT statut FROM chambres WHERE id = $1",
        [chambre_id]
      );

      if (chambreResult.rows.length === 0) {
        throw new Error("La chambre spécifiée n'existe pas.");
      }

      const chambreStatut = chambreResult.rows[0].statut;

      if (chambreStatut !== 'disponible') {
        throw new Error("La chambre n'est pas disponible pour une réservation.");
      }

      // Démarrer une transaction
      await pool.query("BEGIN");

      // Insérer la réservation
      const reservationResult = await pool.query(
        "INSERT INTO reservations (client_id, chambre_id, date_debut, date_fin, statut, montant_total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [client_id, chambre_id, date_debut, date_fin, statut, montant_total]
      );

      const reservation = reservationResult.rows[0];

      // Mettre à jour le statut de la chambre à 'occupée'
      await pool.query(
        "UPDATE chambres SET statut = 'occupée' WHERE id = $1",
        [chambre_id]
      );

      // Insérer automatiquement la facture associée
      const factureResult = await pool.query(
        "INSERT INTO factures (client_id, reservation_id, montant_total) VALUES ($1, $2, $3) RETURNING *",
        [client_id, reservation.id, montant_total]
      );

      // Valider la transaction
      await pool.query("COMMIT");

      return { reservation, facture: factureResult.rows[0] };
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await pool.query("ROLLBACK");
      console.error("Erreur lors de la création de la réservation et de la facture :", error);
      throw error;
    }
  },

  async update(id, { client_id, chambre_id, date_debut, date_fin, statut, montant_total }) {
    const result = await pool.query(
      "UPDATE reservations SET client_id = $1, chambre_id = $2, date_debut = $3, date_fin = $4, statut = $5, montant_total = $6 WHERE id = $7 RETURNING *",
      [client_id, chambre_id, date_debut, date_fin, statut, montant_total, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query("DELETE FROM reservations WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  },

  async checkAndUpdateChambreStatus() {
    try {
      // Récupérer les réservations terminées
      const currentDate = new Date().toISOString().split('T')[0]; // Date du jour au format YYYY-MM-DD
      const reservationsResult = await pool.query(
        "SELECT id, chambre_id FROM reservations WHERE date_fin < $1 AND statut = 'active'",
        [currentDate]
      );

      // Mettre à jour le statut des chambres associées
      for (const reservation of reservationsResult.rows) {
        await pool.query(
          "UPDATE chambres SET statut = 'disponible' WHERE id = $1",
          [reservation.chambre_id]
        );

        // Mettre à jour le statut de la réservation à 'terminée'
        await pool.query(
          "UPDATE reservations SET statut = 'terminée' WHERE id = $1",
          [reservation.id]
        );
      }

      console.log("Statut des chambres et réservations mis à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut des chambres :", error);
      throw error;
    }
  },
};

export default Reservation;