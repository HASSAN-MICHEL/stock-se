// config/stockdb.js
import { Sequelize } from 'sequelize';

const sequelizeStock = new Sequelize(
  'stock_db',  // Nom de la base de données des stocks
  'postgres',  // Nom d'utilisateur
  'HASSAN237', // Mot de passe
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, // Désactive le logging SQL
  }
);

export default sequelizeStock;
