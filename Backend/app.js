// Main Entry Point (app.js)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const notePdfRoutes = require('./routes/notePdfRoutes');  // Import the new combined route
const { dbConnect } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Increase payload limit to handle large data (e.g., 50MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Database Connection
dbConnect();

// Routes
app.use('/api', notePdfRoutes);  // Use the new combined routes under '/api'

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Server Start
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
