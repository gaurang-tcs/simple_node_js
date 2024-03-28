const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const port =  3001;

app.use(bodyParser.json());
app.use('/users', userRoutes);

async function startServer() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'nodejs',
      port:3306
    });

    await connection.connect();
    console.log('Connected to MySQL database');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

startServer();