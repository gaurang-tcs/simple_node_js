const userModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

const createUser = async (req, res) => {
  const { username, address } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'username required' });
  }
  try {
    const users = await userModel.addNewUser(username, address);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, address } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required!' });
  }
  try {
    const users = await userModel.updateExisitingUser(userId, username, address);
    res.status(201).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'User id is required!' });
  }
  try {
    const users = await userModel.deleteExisitingUser(userId);
    res.status(201).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error in delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};