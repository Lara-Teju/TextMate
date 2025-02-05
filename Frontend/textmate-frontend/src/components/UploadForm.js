// src/components/UploadForm.js
import React, { useState } from 'react';
import { uploadPDF } from '../services/api';
import SplashScreen from './SplashScreen';
import './UploadForm.css';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [headingSize, setHeadingSize] = useState(16);
  const [subheadingSize, setSubheadingSize] = useState(14);
  const [contentSize, setContentSize] = useState(12);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert('Please select a PDF file.');
    if (!headingSize || !subheadingSize || !contentSize) {
      return alert('Please enter all font sizes.');
    }

    setUploading(true);
    try {
      const response = await uploadPDF(file, headingSize, subheadingSize, contentSize);

  // Log the response to understand its structure
  console.log('Backend Response:', response)
      
    // Ensure the correct extraction of the unique document ID
    if (response && response.note && response.note._id) {
      const noteId = response.note._id; // Correctly extracting the ID
      alert('PDF uploaded and processed!');
      onUploadSuccess(noteId); // Passing the noteId to the parent component
    } else {
      throw new Error('Unexpected response from server.');
    }
  } catch (error) {
    console.error('Error during upload:', error.message || error);
    alert('Upload failed. Please try again.');
  }
    
    setUploading(false);
    
  };

  return (
    <div className="upload-form-container">
      {uploading && <SplashScreen />}
      <h2 className="upload-title">Upload Your PDF</h2>
      <div className="form-group">
        <label className="form-label">Select PDF:</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="form-input" />
      </div>
      <div className="form-group">
        <label className="form-label">Heading Font Size:</label>
        <input
          type="number"
          value={headingSize}
          onChange={(e) => setHeadingSize(e.target.value)}
          className="form-input"
          min="1"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Subheading Font Size:</label>
        <input
          type="number"
          value={subheadingSize}
          onChange={(e) => setSubheadingSize(e.target.value)}
          className="form-input"
          min="1"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Content Font Size:</label>
        <input
          type="number"
          value={contentSize}
          onChange={(e) => setContentSize(e.target.value)}
          className="form-input"
          min="1"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`upload-button ${uploading ? 'disabled' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
    </div>
  );
};

export default UploadForm;

