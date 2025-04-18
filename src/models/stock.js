import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


    const Stock = sequelize.define('Stock', {
       
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique:true
        },
        quantity_available: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0,
        },
     
  stock_threshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
});

export default Stock;