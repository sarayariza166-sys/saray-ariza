const path = require('path');

// Cargar el archivo de entorno correspondiente
const envFile =
  process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env';

require('dotenv').config({
  path: path.resolve(__dirname, envFile)
});

const mysql = require('mysql');

console.log('--- CONFIGURACIÓN MYSQL ---');
console.log('HOST:', process.env.DB_HOST);
console.log('USER:', process.env.DB_USER);
console.log('DATABASE:', process.env.DB_NAME);
console.log('PORT:', process.env.DB_PORT);

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_node',
  port: Number(process.env.DB_PORT) || 3307
});

db.connect((err) => {
  if (err) {
    console.error('ERROR MYSQL:', err);
    return;
  }

  console.log(`Base de datos conectada: ${process.env.DB_NAME}`);
});

module.exports = db;