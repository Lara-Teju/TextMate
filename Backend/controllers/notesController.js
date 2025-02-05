// Notes Controller (controllers/notesController.js)
const Note = require('../models/Note');

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
};

// ✅ Create a new note
const createNote = async (req, res) => {
  try {
      const { fileName, notes } = req.body;
      const newNote = new Note({ fileName, notes });
      await newNote.save();
      res.status(201).json(newNote);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



const saveNotes = async (req, res) => {
  try {
    const { fileName, notes } = req.body;

    console.log('Received notes:', JSON.stringify(notes, null, 4));

    // Validate that notes is an array of headings
    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Notes must be an array.' });
    }

    // Validate each heading
    for (const heading of notes) {
      if (typeof heading.heading !== 'string' || !Array.isArray(heading.subheadings)) {
        return res.status(400).json({ error: 'Invalid heading structure.' });
      }

      // Validate each subheading
      for (const sub of heading.subheadings) {
        if (typeof sub.subheading !== 'string' || typeof sub.content !== 'object') {
          return res.status(400).json({ error: 'Invalid subheading structure.' });
        }
      }
    }

    const newNote = new Note({
      fileName,
      notes,
    });

    await newNote.save();

    console.log('Saved note:', JSON.stringify(newNote, null, 2));

    // Return the full note document with _id
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ error: 'Failed to save notes.' });
  }
};


module.exports = { getAllNotes, createNote, saveNotes };