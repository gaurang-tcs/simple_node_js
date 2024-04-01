// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../db');
const moment = require('moment');
const { decryptToken } = require('../utils/common');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', status: 401 });
    }

    jwt.verify(token, 'secretKey', async (err, decoded) => {
        if (err) {
            const tokenError = (err?.expiredAt < moment(new Date())) ? "Token Expired!" : "Invalid Token"
            return res.status(401).json({ message: tokenError, status: 401 });
        }

        const [user] = await db.execute("SELECT token FROM user WHERE id = ?", [decoded.userId])
        const decryptedToken = decryptToken(user[0].token)
        req.userId = decoded.userId;
        req.token = token;
        if (user?.length && (user[0]?.token && user[0]?.token !== 'NULL' && user[0]?.token !== '') && decryptedToken === token) {
            next();
        }
        else {
            return res.status(401).json({ message: 'Unauthorized', status: 401 });
        }
    });
};

module.exports = { verifyToken };