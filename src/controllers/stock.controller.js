
import Stock from "../models/stock.model.js";

    // Créer un nouveau stock
 export const   createStock = async (req, res) => {
     const { produit_id, quantity, threshold } = req.body;  // Récupérer les données du corps de la requête
        try {
            const newStock = await StockService.createStock(produit_id, quantity, threshold);  // Appel au service
            res.status(201).json(newStock);  // Répondre avec le nouveau stock créé
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });  // Répondre avec une erreur si nécessaire
        }
    }

export const getStockByProductId = async (req, res) => {
    try {
        const { produit_id } = req.params;
        
        const stock = await Stock.findOne({ where: { product_id: produit_id } });

        if (!stock) {
            return res.status(404).json({ message: "Stock non trouvé pour ce produit" });
        }

        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};