// Notes Routes (routes/notesRoutes.js)
const express = require('express');
const { getAllNotes, createNote, saveNotes } = require('../controllers/notesController');

const router = express.Router();

router.get('/', getAllNotes);
router.post('/create', createNote);
router.post('/save', saveNotes);

module.exports = router;