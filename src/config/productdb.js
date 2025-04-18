// config/productdb.js

import { Sequelize } from 'sequelize';

const sequelizeProduct = new Sequelize(
  'productdb', // Nom de la base de données
  'postgres',  // Nom d'utilisateur
  'HASSAN237', // Mot de passe
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, // Optionnel, désactive les logs SQL
  }
);

export default sequelizeProduct;
