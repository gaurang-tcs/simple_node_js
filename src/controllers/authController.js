const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');
const { encryptToken } = require('../utils/common');
const Tokens = require('../models/tokenModal');
const moment = require('moment');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        const alreadyRegUser = await User.findOne({ where: { email } });
        if (alreadyRegUser) {
            return res.status(400).json({ message: 'User already registered!', status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword, address });
        res.status(201).json({ message: 'User registered successfully', status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user', status: 500 });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        let existUserToken
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }
        else{
            existUserToken = await Tokens.findByPk(user.id)
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }

        const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' });
        const encryptedToken = encryptToken(token);

        if(existUserToken){
            existUserToken.update({token: encryptedToken})
        }
        else{
            await Tokens.create({ id: user?.id, token: encryptedToken })
        }
        res.status(200).json({ token, status: 200, message: 'Token generated successfully!' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to log in', status: 500 });
    }
};

const logoutUser = async (req, res) => {
    const { userId } = req;
    try {
        const token = await Tokens.findByPk(userId);
        if (!token) {
            return res.status(401).json({ message: 'User does not exist!', status: 401 });
        }

        if (!token.token) {
            return res.status(401).json({ message: 'User already logged out!', status: 401 });
        }

        await token.destroy()
        res.status(200).json({ message: 'User logged out successfully!', status: 200 });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Failed to log out', status: 500 });
    }
};

module.exports = { registerUser, loginUser, logoutUser };