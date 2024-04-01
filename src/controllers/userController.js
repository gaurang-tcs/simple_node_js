const userModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', status: 500 });
  }
}

const createUser = async (req, res) => {
  const { username, address } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'username required', status: 400 });
  }
  try {
    const users = await userModel.addNewUser(username, address);
    res.status(201).json({ message: 'User created successfully', status: 201 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', status: 500 });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, address } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required!' });
  }
  try {
    const users = await userModel.updateExisitingUser(userId, username, address);
    res.status(201).json({ message: 'User updated successfully', status: 201 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', status: 500 });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'User id is required!', status: 400 });
  }
  try {
    const users = await userModel.deleteExisitingUser(userId);
    res.status(201).json({ message: 'User deleted successfully!', status: 201 });
  } catch (error) {
    console.error('Error in delete user:', error);
    res.status(500).json({ message: 'Failed to delete user', status: 500 });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};