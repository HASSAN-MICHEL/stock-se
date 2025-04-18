import express from "express";
import cors from "cors"; 
import chambreRoutes from "./routes/chambreRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import boissonRoutes from "./routes/boissonRoutes.js";
import venteBoissonRoutes from "./routes/venteBoissonRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; 
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js"; // Vérifie que le chemin est correct
import reservationRoutes from "./routes/reservationRoutes.js"; // Import des routes de réservation

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chambres", chambreRoutes);
app.use("/api/restaurant/menu", menuRoutes);
app.use("/api/restaurant/order", orderRoutes); 
app.use("/api/vente-boissons", venteBoissonRoutes);
app.use("/api/boissons", boissonRoutes);
app.use("/users", userRoutes);
app.use("/api/clients", clientRoutes);

// Routes pour les réservations
app.use("/api/reservations", reservationRoutes); // Utilisation des routes de réservation

// Route pour vérifier et mettre à jour le statut des chambres
app.post("/api/reservations/check-status", async (req, res) => {
  try {
    // Appeler la méthode pour vérifier et mettre à jour le statut des chambres
    await reservationController.checkAndUpdateChambreStatus();
    res.status(200).json({ message: "Statut des chambres et réservations mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut des chambres :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut des chambres", error: error.message });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;