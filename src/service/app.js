// src/service/app.js
import express from 'express';
import StockRoutes from '../routes/StockRoutes.js';
import bodyParser from 'body-parser';
import sequelize from '../config/database.js';
import Stock from '../models/stock.js';
import StockHistory from '../models/StockHistory.js';
import cors from 'cors';


const app = express();

const PORT = 5001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/stock", StockRoutes);

// Démarrage du serveur après connexion à la BDD
sequelize.sync().then(() => {
  console.log('📦 Base de données Stock connectée');
  app.listen(PORT, () => {
    console.log(`🚀 Microservice Stock disponible sur http://localhost:${PORT}`);
  });
});
