const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [alreadyRegUser] = await db.execute("SELECT * FROM user WHERE email = ?", [email])
        console.log("Already user----->",alreadyRegUser)

        if(alreadyRegUser.length !== 0){
            return res.status(400).json({message: 'User already registered!'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [userData] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        if (!userData || userData.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, userData[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: userData[0].id }, 'secretKey', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};


module.exports = { registerUser, loginUser };