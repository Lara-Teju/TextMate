// src/pages/NotesListPage.js
import React, { useEffect, useState } from 'react';
import { fetchNotesList } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './NotesListPage.css';
import bookImage1 from '../assets/book_icons/book_image-1.png';
import bookImage2 from '../assets/book_icons/book_image-2.png';
import bookImage3 from '../assets/book_icons/book_image-3.png';
import bookImage4 from '../assets/book_icons/book_image-4.png';
import bookImage5 from '../assets/book_icons/book_image-5.png';

const bookIcons = [
  bookImage1,
  bookImage2,
  bookImage3,
  bookImage4,
  bookImage5,
];

const getRandomBookIcon = () => {
  return bookIcons[Math.floor(Math.random() * bookIcons.length)];
};

const NotesListPage = () => {
  const [notesList, setNotesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotes = async () => {
      const notes = await fetchNotesList();
      setNotesList(notes);
    };
    loadNotes();
  }, []);

  const openNote = (note) => {
    navigate(`/view/${note._id}`);
  };

  return (
    <div className="notes-list-container">
      <h1 className="notes-list-title">Your Saved Notes</h1>
      <div className="notes-grid">
        {notesList.map((note, index) => (
          <div key={index} className="book-item" onClick={() => openNote(note)}>
            <img src={getRandomBookIcon()} alt="Book" className="book-icon" />
            <p className="note-title">{note.fileName}</p>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default NotesListPage;
