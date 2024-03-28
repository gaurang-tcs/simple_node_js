// db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'nodejs',
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

module.exports = connection;