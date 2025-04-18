import axios from "axios";

const PRODUCT_SERVICE_URL = "http://localhost:5000/api/products"; // URL du microservice Produits



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
// Vérifie si un produit existe dans la base de Produits
async function isProductExists(productId) {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
        return response.status === 200; // Le produit existe
    } catch (error) {
        return false; // Le produit n'existe pas
    }
}

export default isProductExists;
