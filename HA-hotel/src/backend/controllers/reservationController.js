import Reservation from "../models/reservation.js"; // Assurez-vous que le chemin est correct

const reservationController = {
  async getAll(req, res) {
    try {
      const reservations = await Reservation.getAll();
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const reservation = await Reservation.getById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération de la réservation", error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { client_id, chambre_id, date_debut, date_fin, statut, montant_total } = req.body;

      // Création de la réservation et génération de la facture en une seule transaction
      const { reservation, facture } = await Reservation.create({ client_id, chambre_id, date_debut, date_fin, statut, montant_total });

      res.status(201).json({
        message: "Réservation créée avec succès !",
        reservation,
        facture,
      });
    } catch (err) {
      console.error("Erreur lors de la création de la réservation et de la facture :", err);
      res.status(500).json({ message: err.message || "Erreur lors de la création de la réservation", error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { client_id, chambre_id, date_debut, date_fin, statut, montant_total } = req.body;

      const updatedReservation = await Reservation.update(req.params.id, { client_id, chambre_id, date_debut, date_fin, statut, montant_total });

      if (!updatedReservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      res.json({
        message: "Réservation mise à jour avec succès !",
        reservation: updatedReservation,
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de la réservation", error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const reservationId = req.params.id;
      console.log("ID de la réservation à supprimer :", reservationId);

      const reservation = await Reservation.getById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      await Reservation.delete(reservationId);
      console.log("Réservation supprimée :", reservationId);

      res.status(204).json({ message: "Réservation supprimée avec succès !" });
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression de la réservation", error: err.message });
    }
  },

  async checkAndUpdateChambreStatus(req, res) {
    try {
      // Appeler la méthode pour vérifier et mettre à jour le statut des chambres
      await Reservation.checkAndUpdateChambreStatus();

      res.status(200).json({ message: "Statut des chambres et réservations mis à jour avec succès." });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut des chambres :", err);
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut des chambres", error: err.message });
    }
  },
};

export const { getAll, getById, create, update, checkAndUpdateChambreStatus } = reservationController;
export const deleteReservation = reservationController.delete;