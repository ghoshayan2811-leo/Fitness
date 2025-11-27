const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateFitnessPlan, generateDietSuggestion } = require('../controllers/aiController');
const Plan = require('../models/Plan');

// ==================== PUBLIC ROUTES ====================
router.post('/trial', generateFitnessPlan);

// ==================== PROTECTED ROUTES ====================
router.post('/generate-plan', protect, generateFitnessPlan);
router.post('/diet-suggestion', protect, generateDietSuggestion);

// ✅ Get user's plan history
router.get('/plans', protect, async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans'
    });
  }
});

// ✅ Get single plan by ID
router.get('/plans/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plan'
    });
  }
});

// ✅ Delete plan
router.delete('/plans/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete plan'
    });
  }
});

module.exports = router;
