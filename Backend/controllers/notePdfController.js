// Merged Controller (controllers/notePdfController.js)
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');  // Import FormData
const { extractText } = require('../utilities/fileHandler'); // File handling for PDFs
const { processPDF } = require('../utilities/apiHandler'); // API handler to interact with Gemini
const Note = require('../models/Note'); // Mongoose model for Notes



// Combined endpoint: process PDF and save notes in MongoDB
const uploadPDFToFlask = async (req, res) => {
  try {
    // 1. Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // 2. Create formData and append the PDF and additional fields
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(req.file.path), { filename: req.file.originalname });
    formData.append('heading_size', req.body.heading_size);
    formData.append('subheading_size', req.body.subheading_size);
    formData.append('content_size', req.body.content_size);

    // 3. Send the PDF to Flask for processing
    const flaskApiUrl = 'http://localhost:5001/process_pdf';
    const flaskResponse = await axios.post(flaskApiUrl, formData, {
      headers: { ...formData.getHeaders() },
    });
    console.log("Flask Response:", JSON.stringify(flaskResponse.data, null, 2));

    // 4. Extract the expected data from Flask's JSON response
    // Note: If fileName isn’t provided, use the original file name.
    const { fileName, notes } = flaskResponse.data;
    if (!notes) {
      return res.status(400).json({ error: 'Flask response missing notes.' });
    }
    const finalFileName = fileName || req.file.originalname;

    // 5. Save the note in MongoDB
    const newNote = new Note({ fileName: finalFileName, notes});
    await newNote.save();

    // 6. Return the saved note (with its _id) to the frontend
    return res.status(201).json({
      message: 'Notes generated and saved successfully!',
      note: newNote
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return res.status(500).json({ error: 'Failed to process PDF.' });
  }
};

// **Step 2: Save Notes Received from Flask**
const saveNotesToDB = async (req, res) => {
  try {
      const { fileName, notes } = req.body;

      if (!fileName || !notes) {
          return res.status(400).json({ error: 'fileName and notes are required.' });
      }

      console.log('Received notes:', JSON.stringify(notes, null, 2));

      // Validate that notes are in the correct structure
      if (!Array.isArray(notes)) {
          return res.status(400).json({ error: 'Notes must be an array.' });
      }

      const newNote = new Note({ fileName,notes,}); //createdAt: Date.now() });
      await newNote.save();

      console.log('Saved note:', JSON.stringify(newNote, null, 2));

      res.status(201).json({ message: 'Notes saved successfully!', note: newNote });

  } catch (error) {
      console.error('Error saving notes:', error);
      res.status(500).json({ error: 'Failed to save notes.' });
  }
};
  

// Get all notes from the database
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
};

// Create a new note manually (if needed for custom note creation)
const createNote = async (req, res) => {
  try {
    const { fileName, notes } = req.body;
    const newNote = new Note({
      fileName,
      notes,
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save notes after validation (optional for manual note entries)
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

module.exports = {
  uploadPDFToFlask,
  getAllNotes,
  createNote,
  saveNotes,
  saveNotesToDB,
};
