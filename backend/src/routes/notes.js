const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { authenticate } = require('../middlewares/auth'); 


router.post('/studynotes', authenticate, noteController.createNote);


module.exports = router;