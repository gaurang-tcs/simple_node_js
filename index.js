const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { testConnection, sequelize } = require('./src/db');
const schedule = require('node-schedule');
const { Op } = require('sequelize');
const Tokens = require('./src/models/tokenModal');

dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/', authRoutes);

const job = schedule.scheduleJob('40 16 * * *', async () => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setHours(thresholdDate.getHours() - 24);
    await Tokens.destroy({
      where: {
        created_at: {
          [Op.lt]: thresholdDate,
        },
      },
    });

    console.log('Old tokens deleted successfully!');
  } catch (error) {
    console.error('Error deleting old tokens:', error);
  }
});

// Test database connection
async function startServer() {
  try {
    await testConnection();
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

startServer();