// models/userModel.js
const db = require('../db');

async function getAllUsers() {
  const [rows] = await db.execute('SELECT * FROM user');
  return rows;
}

async function addNewUser(name) {
  try {
    await db.execute('INSERT INTO user (username) VALUES (?)', [name]);
    db.release();
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

module.exports = {
  getAllUsers,
  addNewUser
};