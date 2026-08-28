const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String
}, { _id: false });

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctIndex: Number,
  explanation: String
}, { _id: false });

const studyPackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  originalFilename: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'docx', 'txt', 'image'] },
  extractedText: { type: String, select: false }, // large field, omit by default
  summary: { type: String, default: '' },
  keyPoints: { type: [String], default: [] },
  flashcards: { type: [flashcardSchema], default: [] },
  quiz: { type: [quizQuestionSchema], default: [] },
  status: {
    type: String,
    enum: ['processing', 'ready', 'error'],
    default: 'processing'
  },
  errorMessage: { type: String, default: null },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date, default: null }
}, { timestamps: true });

// Text index for search
studyPackSchema.index({ title: 'text', summary: 'text' });

module.exports = mongoose.model('StudyPack', studyPackSchema);
