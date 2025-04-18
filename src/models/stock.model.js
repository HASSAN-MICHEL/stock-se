import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Stock = sequelize.define("Stock", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER, // On stocke l'ID du produit ici
        allowNull: false,
    },
    quantity_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    stock_threshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5, // Seuil par défaut pour les alertes
    }
});

export default Stock;
