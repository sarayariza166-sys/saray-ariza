
// backend/nodejs_express/config/config.js

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: envFile });

const mysql = require('mysql2');

const isTest = process.env.NODE_ENV === 'test';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
};

// Azure requiere conexión SSL.
// No aplicar esta configuración a la base de datos de pruebas.
if (!isTest) {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la BD:', err.message);
    throw err;
  }

  console.log(`✅ Base de datos conectada: ${process.env.DB_NAME}`);
});

module.exports = db;
