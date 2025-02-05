// API Handler (utilities/apiHandler.js)
const axios = require('axios');

const processPDF = async (filePath) => {
  try {
    const response = await axios.post('http://localhost:5001/process_pdf', {
      pdf_path: filePath,
    });
    return response.data.notes; // Assuming the response contains structured notes.
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
};

module.exports = { processPDF };
