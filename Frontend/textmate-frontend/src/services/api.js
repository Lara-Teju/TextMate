//src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchNotesList = async () => {
  try {
    const response = await axios.get(`${API_URL}/notes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notes list:', error);
    throw error;
  }
};

// New function: fetch a single note by its ID
export const fetchNoteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note with id ${id}:`, error);
    throw error;
  }
};

export const uploadPDF = async (file, headingSize, subheadingSize, contentSize) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('heading_size', headingSize);
  formData.append('subheading_size', subheadingSize);
  formData.append('content_size', contentSize);
  console.log(`Uploading to: ${API_URL}/upload`); // Debugging statement

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchNotes = async () => {
  const response = await axios.get(`${API_URL}/notes`);
  return response.data;
};

export const updateNote = async (noteId, updatedNote) => {
  const response = await axios.put(`${API_URL}/notes/${noteId}`, updatedNote);
  return response.data;
};
