// src/pages/ViewNotesPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNoteById } from '../services/api';
import NotesViewer from '../components/NotesViewer';
import './ViewNotesPage.css';

const ViewNotesPage = () => {
  const { id } = useParams(); // Get note ID from URL (e.g., /view/:id)
  const navigate = useNavigate();

  // State for the retrieved note, loading status, and error handling
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const getNote = async () => {
      try {
        const fetchedNote = await fetchNoteById(id);
        setNote(fetchedNote);
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };
    getNote();
  }, [id]);

  // If the note is still loading or there was an error, display appropriate messages
  if (loading) {
    return <div className="view-notes-container"><p>Loading...</p></div>;
  }
  if (error) {
    return <div className="view-notes-container"><p>{error}</p></div>;
  }
  if (!note) {
    return <div className="view-notes-container"><p>Note not found.</p></div>;
  }

  // Assume that your note document has a structure where `note.notes` is an array of pages/sections.
  // Adjust this depending on your actual note data structure.
  const notesArr = note.notes || [];

  // If there are no notes to display, show a message.
  if (notesArr.length === 0) {
    return (
      <div className="view-notes-container">
        <p>No note content available.</p>
        <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  // Pagination functions
  const nextPage = () => {
    if (page < notesArr.length - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="view-notes-container">
      <NotesViewer notes={[notesArr[page]]} />
      <div className="navigation-buttons">
        <button onClick={prevPage} disabled={page === 0}>Previous Page</button>
        <button onClick={nextPage} disabled={page === notesArr.length - 1}>Next Page</button>
      </div>
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default ViewNotesPage;
