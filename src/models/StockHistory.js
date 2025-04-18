
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StockHistory = sequelize.define("StockHistory", {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.ENUM("entry", "exit"),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default StockHistory;