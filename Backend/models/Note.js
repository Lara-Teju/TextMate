//Note.js
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  summary: String,
  keywords: [String],
  analogy: String,
});

const SubheadingSchema = new mongoose.Schema({
  subheading: String,
  content: ContentSchema,
});

const HeadingSchema = new mongoose.Schema({
  heading: String,
  subheadings: [SubheadingSchema],
});

const NoteSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  notes: [HeadingSchema],
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);

