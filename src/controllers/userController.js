const userModel = require('../models/userModel');

async function getAllUsers(req, res) {
  console.log(req, res)
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function createUser(req, res) {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const users = await userModel.addNewUser(username);
    console.log(users)
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

module.exports = {
  getAllUsers,
  createUser
};