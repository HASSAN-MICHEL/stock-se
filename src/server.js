import express from "express";
import cors from "cors";
import bodyParser from "body-parser";  // Importer la fonction de mise à jour des stocks
import sequelize from "./config/database.js";
import stockRoutes from "./routes/stock.routes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", stockRoutes);

sequelize.sync()
    .then(() => console.log("Base de données synchronisée"))
    .catch(err => console.error("Erreur de synchronisation :", err));

app.listen(5001, () => console.log("Serveur démarré sur http://localhost:5001"));

console.log("Connexion à PostgreSQL avec :", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_HOST, process.env.DB_PORT);
