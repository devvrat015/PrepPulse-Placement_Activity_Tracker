const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['DSA', 'RESUME', 'INTERVIEW', 'APPLICATION'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    confidenceLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
