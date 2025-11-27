const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  parameters: {
    goal: String,
    activityLevel: String,
    focusArea: String,
    duration: String,
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    dietaryRestrictions: String
  },
  userInfo: {
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    goal: String,
    activityLevel: String,
    bmi: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', PlanSchema);
