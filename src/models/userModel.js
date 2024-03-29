// models/userModel.js
const db = require('../db');

async function getAllUsers() {
  const [rows] = await db.execute('SELECT id, username, email, address FROM user');
  return rows;
}

async function addNewUser(name, address) {
  try {
    await db.execute('INSERT INTO user (username, address) VALUES (?, ?)', [name, address]);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

const updateExisitingUser = async (userId, username, address) => {
  try {
    const sql = 'UPDATE user SET username = ?, address = ? WHERE id = ?';
    await db.execute(sql, [username, address, userId]);
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

const deleteExisitingUser = async (userId) => {
  try {
    const sql = 'DELETE FROM user WHERE id = ?';
    await db.execute(sql, [userId]);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

module.exports = {
  getAllUsers,
  addNewUser,
  updateExisitingUser,
  deleteExisitingUser
};