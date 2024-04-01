const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { encryptToken } = require('../utils/common');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        const [alreadyRegUser] = await db.execute("SELECT * FROM user WHERE email = ?", [email])

        if (alreadyRegUser.length !== 0) {
            return res.status(400).json({ message: 'User already registered!', status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO user (username, email, password, address, token) VALUES (?, ?, ?, ?, ?)', [username, email, hashedPassword, (address ?? null), null]);

        res.status(201).json({ message: 'User registered successfully', status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user', status: 500 });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [userData] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        if (!userData || userData.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, userData[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: userData[0].id }, 'secretKey', { expiresIn: '1h' });
        const encryptedToken = encryptToken(token)
        await db.execute('UPDATE user SET token = ? WHERE id = ?', [encryptedToken, userData[0].id]);
        res.status(200).json({ token: token, status: 200, message: "Token generated successfully!" });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to log in', status: 500 });
    }
};

const logoutUser = async (req, res) => {
    try {
        const [user] = await db.execute('SELECT * FROM user WHERE id = ?', [req?.userId])
        if (!user || !user.length) {
            return res.status(401).json({ message: 'User not available!', status: 401 })
        }

        if (!user[0].token) {
            res.status(401).json({ message: 'User already logged out!', status: 401 })
        }
        await db.execute('UPDATE user SET token = NULL WHERE id = ?', [req?.userId]);
        res.status(200).json({ message: 'User logged out successfully!', status: 200 })
    } catch (error) {
        res.status(500).json({ message: 'Failed to log out', status: 500 });
    }
}


module.exports = { registerUser, loginUser, logoutUser };