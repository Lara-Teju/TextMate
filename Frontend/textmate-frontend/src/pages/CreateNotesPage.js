//pagesCreateNotesPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';  // Ensure this component calls uploadPDF correctly
import { uploadPDF } from '../services/api';  // Import the function to handle PDF upload
import './CreateNotesPage.css';

const CreateNotesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = (noteId) => {
    setIsLoading(false);
    navigate(`/view/${noteId}`); // Redirect to the view page with the generated note ID
  };

  const handleUploadStart = () => {
    setIsLoading(true);
  };

  const handleUpload = async (file, headingSize, subheadingSize, contentSize) => {
    handleUploadStart();
    try {
      const result = await uploadPDF(file, headingSize, subheadingSize, contentSize);
      handleUploadSuccess(result._id);  // Assuming backend returns _id of the saved note
    } catch (error) {
      console.error('Upload failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="create-notes-container">
      {isLoading ? (
        <div className="splash-container">
          <img src="src/assets/logo.png" alt="Loading..." className="splash-logo" />
          <p>Generating your notes, please wait...</p>
        </div>
      ) : (
        <>
          <UploadForm onUploadSuccess={handleUploadSuccess} onUploadStart={handleUploadStart} onUpload={handleUpload} />
          <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
        </>
      )}
    </div>
  );
};

export default CreateNotesPage;

