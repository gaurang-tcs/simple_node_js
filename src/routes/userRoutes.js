const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, userController.getAllUsers);
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;