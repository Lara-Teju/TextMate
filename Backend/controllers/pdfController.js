// PDF Controller (controllers/pdfController.js)
const { extractText } = require('../utilities/fileHandler');
const { processPDF } = require('../utilities/apiHandler');
const Note = require('../models/Note');

const uploadPDF = async (req, res) => {
  try {
    const notesData = await processPDF(req.file.path);

    const formattedNotes = Object.entries(notesData).map(([heading, subheadings]) => ({
      heading,
      subheadings: Object.entries(subheadings).map(([subheading, content]) => ({
        subheading,
        content,
      })),
    }));

    const noteDocument = new Note({
      fileName: req.file.originalname,
      notes: formattedNotes,
    });

    await noteDocument.save();

    // Return the saved document along with its _id
    res.status(201).json({
      message: 'Notes generated and saved',
      notes: formattedNotes,
      _id: noteDocument._id,  // Include the _id in the response
    });
  } catch (error) {
    console.error('PDF Processing Error:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
};

module.exports = { uploadPDF };
