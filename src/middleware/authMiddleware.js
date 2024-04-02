const jwt = require('jsonwebtoken');
const  User  = require('../models/userModal'); // Assuming you have imported the User model from Sequelize
const moment = require('moment');
const { decryptToken } = require('../utils/common');
const Tokens = require('../models/tokenModal');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', status: 401 });
    }

    jwt.verify(token, 'secretKey', async (err, decoded) => {
        if (err) {
            const tokenError = (err?.expiredAt < moment(new Date())) ? 'Token Expired!' : 'Invalid Token';
            return res.status(401).json({ message: tokenError, status: 401 });
        }

        try {
            const userToken = await Tokens.findByPk(decoded.userId);
            if (!userToken || !userToken.token) {
                return res.status(401).json({ message: 'Unauthorized', status: 401 });
            }

            const decryptedToken = decryptToken(userToken.token);
            if (decryptedToken !== token) {
                return res.status(401).json({ message: 'Unauthorized', status: 401 });
            }

            req.userId = decoded.userId;
            req.token = token;
            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(500).json({ message: 'Internal Server Error', status: 500 });
        }
    });
};

module.exports = { verifyToken };