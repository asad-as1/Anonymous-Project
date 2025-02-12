const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth'); 

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/profile', authenticate, userController.getProfile);


module.exports = router;