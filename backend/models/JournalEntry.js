const mongoose = require('mongoose');

// ✅ Allowed UI emotions (INCLUDING Calm)
const UI_EMOTIONS = [
  'Happy',     // joy
  'Sad',       // sadness
  'Anxious',   // fear
  'Angry',     // anger
  'Surprise',  // surprise
  'Love',      // love
  'Calm'       // 🔥 added (derived emotion)
];

// ✅ Raw ML model emotions (DO NOT CHANGE)
const RAW_EMOTIONS = [
  'anger',
  'fear',
  'joy',
  'love',
  'sadness',
  'surprise'
];

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  text: {
    type: String,
    required: [true, 'Journal text is required'],
    trim: true,
    minlength: [3, 'Text must be at least 3 characters long'],
  },

  // ✅ UI-friendly emotion (mapped in controller)
  emotion: {
    type: String,
    enum: UI_EMOTIONS,
    required: true,
  },

  // ✅ Raw ML output (strict)
  rawEmotion: {
    type: String,
    enum: RAW_EMOTIONS,
    required: true,
  },

  // ✅ Model confidence score
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },

  // ✅ Optional tags
  tags: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// 🔥 Optional: prevent duplicate empty entries
journalEntrySchema.pre('save', function (next) {
  if (!this.text || !this.text.trim()) {
    return next(new Error('Journal text cannot be empty'));
  }
  next();
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);