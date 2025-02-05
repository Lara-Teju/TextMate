// File Handler (utilities/fileHandler.js)
const pdfParse = require('pdf-parse');
const fs = require('fs');

const extractText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
};

module.exports = { extractText };