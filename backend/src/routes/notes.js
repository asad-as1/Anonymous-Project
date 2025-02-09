const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { authenticate } = require('../middlewares/auth'); 


router.post('/studynotes', authenticate, noteController.createNote);
router.post('/getAllNotes', authenticate, noteController.getAllNotes);
router.post('/deleteNote', authenticate, noteController.deleteNote);


module.exports = router;