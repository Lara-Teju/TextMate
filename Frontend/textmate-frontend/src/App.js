// src/App.js *
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import CreateNotes from './pages/CreateNotesPage';
import ViewNotes from './pages/ViewNotesPage';
import NotesList from './pages/NotesListPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/create" element={<CreateNotes />} />
      <Route path="/view/:id" element={<ViewNotes />} />
      <Route path="/notes" element={<NotesList />} />
    </Routes>
  </Router>
);

export default App;


