// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../db');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'secretKey', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token!' });
        }

        const [user] = await db.execute("SELECT token FROM user WHERE id = ?", [decoded.userId])
        req.userId = decoded.userId;
        if (user?.length && (user[0]?.token && user[0]?.token !== 'NULL' && user[0]?.token !== '')) {
            next();
        }
        else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    });
};

module.exports = { verifyToken };