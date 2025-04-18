import app from "./app.js";
import cors from "cors";  // Importer CORS
import express from "express";


app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
