const express = require('express');
const router = express.Router();
const shortNoteController = require('../controllers/shortNote.controller');
const { authenticate } = require('../middlewares/auth'); 


router.post('/note', authenticate, shortNoteController.createShortNote);
router.post('/getAllNotes', authenticate, shortNoteController.getAllShortNotes);
router.post('/getAllUsersNotes', authenticate, shortNoteController.getAllUsersNotes);
router.post('/:id', authenticate, shortNoteController.getShortNoteById);
router.put('/:id', authenticate, shortNoteController.updateShortNote);
router.post('/deleteNote/:id', authenticate, shortNoteController.deleteShortNote);


module.exports = router;