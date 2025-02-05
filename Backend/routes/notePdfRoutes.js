// routes/notePdfRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadPDFToFlask, getAllNotes, createNote, saveNotes, saveNotesToDB } = require('../controllers/notePdfController');
const Note = require('../models/Note');

const router = express.Router();
//const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });

const upload = multer({ storage });
// PDF upload, processing, and saving notes
router.post('/upload', upload.single('pdf'), uploadPDFToFlask);

// **Route 2: Save Notes (Called by Flask)**
router.post('/save_notes', saveNotesToDB);

// Get all notes
router.get('/notes', getAllNotes);

// Manually create a note
router.post('/notes', createNote);

// Save notes with validation
router.post('/saveNotes', saveNotes);

// In your backend routes file
router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error('Error retrieving note:', error);
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});


module.exports = router;
