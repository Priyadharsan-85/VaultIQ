const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_HOST && process.env.DB_USER) {
  // Use PostgreSQL for Production / Docker
  const isProduction = process.env.NODE_ENV === 'production';
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    ...(isProduction && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  });
} else {
  // Fallback to SQLite for quick local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
