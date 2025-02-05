// src/components/NotesViewer.js
import React from 'react';
import './NotesViewer.css';




const NotesViewer = ({ notes, animationClass }) => (
  <div className={`notes-container ${animationClass}`}>
    {notes.map((note, index) => (
      <div key={index} className="note">
        <h2>{note.heading}</h2>
        {note.subheadings.map((sub, idx) => (
          <div key={idx} className="cornell-layout">
            <div className="keywords">
              <h4>Keywords</h4>
              <ul>
                {sub.content.keywords.map((kw, i) => (
                  <li key={i}>{kw}</li>
                ))}
              </ul>
            </div>
            <div className="summary">
              <h4>Summary</h4>
              <p style={{ whiteSpace: 'pre-line' }}>
                {sub.content.summary}
              </p>
            </div>
            <div className="analogy">
              <h4>Analogy</h4>
              <p style={{ whiteSpace: 'pre-line' }}>
                {sub.content.analogy}
              </p>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default NotesViewer;

