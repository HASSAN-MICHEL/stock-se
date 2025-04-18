
import { Sequelize } from "sequelize";
const sequelize = new Sequelize("stock_db", "postgres", "HASSAN237", {
  host: "localhost",
  dialect: "postgres",
});
export default sequelize;