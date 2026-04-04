const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  predictedMood: {
    type: String,
    enum: ["Happy", "Sad", "Anxious", "Calm", "Angry", "Tired", "Excited"],
    required: true
  },
  tags: [{
    type: String
  }],
  confidence: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Entry', entrySchema);
