const User = require('../models/userModal'); // Import the User model

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'address'] });
    console.log(users)
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', status: 500 });
  }
};

const createUser = async (req, res) => {
  const { username, address } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'username required', status: 400 });
  }
  try {
    await User.create({ username, address });
    res.status(201).json({ message: 'User created successfully', status: 201 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', status: 500 });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, address } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required!' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', status: 404 });
    }

    await user.update({ username, address });
    res.status(201).json({ message: 'User updated successfully', status: 201 });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', status: 500 });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'User id is required!', status: 400 });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', status: 404 });
    }

    await user.destroy();
    res.status(201).json({ message: 'User deleted successfully!', status: 201 });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', status: 500 });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
