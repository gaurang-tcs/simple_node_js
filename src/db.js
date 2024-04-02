// db.js
// const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'nodejs',
// });

// module.exports = connection;

const { Sequelize } = require('sequelize');

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize({
  dialect: 'mysql', // Choose your database dialect (e.g., mysql, postgres, sqlite, etc.)
  host: 'localhost', // Database host
  port: 3306, // Database port (if necessary)
  username: 'root', // Database username
  password: 'password', // Database password
  database: 'nodejs', // Database name
  logging: false, // Disable logging of SQL queries (optional)
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Export the Sequelize instance and testConnection function
module.exports = {
  sequelize,
  testConnection,
};