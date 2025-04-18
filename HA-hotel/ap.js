import express from "express";
import cors from "cors";  // Importer CORS
import chambreRoutes from "./routes/chambreRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Activer CORS pour toutes les origines
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes
app.use("/api/chambres", chambreRoutes);
app.use("/api/restaurant/menu", menuRoutes);
app.use("/api/restaurant/order", orderRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;
