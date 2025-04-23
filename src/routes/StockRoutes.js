// ces ici que j'ai configurer mes routes backend
import express from "express";
import StockController from "../controllers/StockController.js";

const router = express.Router();

router.get("/", StockController.getStock); 
router.put("/:product_id", StockController.updateStock);
router.post("/entry", StockController.stockEntry);
router.post("/exit", StockController.stockExit);
router.get("/alerts/list", StockController.stockAlerts);
// stockRoute.js - remplacer la route problématique

// stockRoute.js - Route renommée pour plus de clarté
router.get("/product/:product_id", StockController.getStockByProductId);
  
router.get("/history/export", StockController.exportHistory);

router.get("/history/full/:product_id", StockController.getFullProductHistory);
router.get("/movements/formatted", StockController.getFormattedMovements);
router.get("/stats/basic", StockController.getBasicStats);
// Ajoutez ces nouvelles routes
router.get("/movements", StockController.getMovementsStats); // Pour les stats par période
router.get("/movements/recent", StockController.getRecentMovements); // Pour les mouvements récents

export default router;
