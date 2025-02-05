// PDF Routes (routes/pdfRoutes.js)
const express = require('express');
const multer = require('multer');
const { uploadPDF } = require('../controllers/pdfController');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.single('pdf'), uploadPDF);

module.exports = router;
