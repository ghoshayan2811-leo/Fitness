const Plan = require('../models/Plan');

const generateFitnessPlan = async (req, res) => {
  try {
    console.log('🤖 AI Controller - Generate Plan Started');
    console.log('📊 Request body:', req.body);
    console.log('👤 User:', req.user?._id || 'Public/Trial User');

    const { goal, activityLevel, focusArea, duration, age, weight, height, gender, dietaryRestrictions } = req.body;

    // Validate required fields
    if (!goal || !age || !weight || !height) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: goal, age, weight, height'
      });
    }

    // Set defaults for optional fields
    const safeDuration = duration || '4_weeks';
    const safeFocusArea = focusArea || 'full_body';
    const safeActivityLevel = activityLevel || 'moderate';
    const safeGender = gender || 'male';

    console.log('✅ Creating fitness plan...');

    // Calculate BMI
    const heightInMeters = parseFloat(height) / 100;
    const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);

    // Generate plan (your existing plan template here)
    const plan = `
╔═══════════════════════════════════════════════════════════════╗
║         ${safeDuration.toUpperCase().replace('_', ' ')} PERSONALIZED FITNESS PLAN                    
╚═══════════════════════════════════════════════════════════════╝

👤 PROFILE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Age: ${age} years
• Gender: ${safeGender.charAt(0).toUpperCase() + safeGender.slice(1)}
• Weight: ${weight} kg
• Height: ${height} cm
• BMI: ${bmi} kg/m²
• Goal: ${goal.replace('_', ' ').toUpperCase()}
• Activity Level: ${safeActivityLevel.toUpperCase()}
• Focus Area: ${safeFocusArea.replace('_', ' ').toUpperCase()}
${dietaryRestrictions ? `• Dietary Restrictions: ${dietaryRestrictions}` : ''}

╔═══════════════════════════════════════════════════════════════╗
║                   WEEKLY WORKOUT SCHEDULE                      
╚═══════════════════════════════════════════════════════════════╝

📅 MONDAY - Upper Body Strength
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Warm-up: 5-10 minutes light cardio
• Push-ups: 3 sets × 12 reps
• Dumbbell Bench Press: 3 sets × 10 reps
• Shoulder Press: 3 sets × 12 reps
• Tricep Dips: 3 sets × 10 reps
• Cool-down: 5-10 minutes stretching

📅 TUESDAY - Lower Body Power
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Warm-up: 5-10 minutes light cardio
• Squats: 4 sets × 12 reps
• Lunges: 3 sets × 10 reps per leg
• Leg Press: 3 sets × 12 reps
• Calf Raises: 3 sets × 15 reps
• Cool-down: 5-10 minutes stretching

📅 WEDNESDAY - Active Recovery
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 30-minute walk, yoga, or stretching

📅 THURSDAY - Back & Biceps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Warm-up: 5-10 minutes light cardio
• Pull-ups or Lat Pulldowns: 3 sets × 10 reps
• Bent-over Rows: 3 sets × 12 reps
• Bicep Curls: 3 sets × 12 reps
• Hammer Curls: 3 sets × 10 reps
• Cool-down: 5-10 minutes stretching

📅 FRIDAY - Core & Cardio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Planks: 3 sets × 45-60 seconds
• Russian Twists: 3 sets × 20 reps
• Leg Raises: 3 sets × 15 reps
• Mountain Climbers: 3 sets × 20 reps
• 20-30 minutes cardio

📅 SATURDAY - Active Day
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Sports, swimming, or outdoor activities

📅 SUNDAY - Complete Rest
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Focus on recovery and meal prep

╔═══════════════════════════════════════════════════════════════╗
║                    NUTRITION GUIDELINES                        
╚═══════════════════════════════════════════════════════════════╝

${goal === 'weight_loss' ? `
🔥 WEIGHT LOSS NUTRITION:
• Daily Calories: Deficit of 300-500 calories
• Protein: ${Math.round(weight * 1.8)}g per day
• Water: Minimum 2.5-3 liters per day
` : goal === 'muscle_gain' ? `
💪 MUSCLE GAIN NUTRITION:
• Daily Calories: Surplus of 300-500 calories
• Protein: ${Math.round(weight * 2.2)}g per day
• Water: Minimum 3-4 liters per day
` : `
⚖️ MAINTENANCE NUTRITION:
• Daily Calories: Maintenance level
• Protein: ${Math.round(weight * 1.8)}g per day
• Water: Minimum 2-3 liters per day
`}

✨ Generated by FITSPHERE AI on ${new Date().toLocaleString()}
    `;

    const planData = {
      plan: plan,
      userInfo: {
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender: safeGender,
        goal: goal,
        activityLevel: safeActivityLevel,
        bmi: bmi
      },
      parameters: {
        goal,
        activityLevel: safeActivityLevel,
        focusArea: safeFocusArea,
        duration: safeDuration,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender: safeGender,
        dietaryRestrictions
      }
    };

    // ✅ Save to database if user is authenticated
    if (req.user) {
      try {
        const savedPlan = new Plan({
          userId: req.user._id,
          ...planData
        });
        await savedPlan.save();
        console.log('✅ Plan saved to database with ID:', savedPlan._id);
        planData._id = savedPlan._id;
      } catch (dbError) {
        console.error('⚠️ Failed to save plan to DB:', dbError);
        // Continue without saving - don't fail the request
      }
    }

    console.log('✅ Plan generated successfully');

    return res.json({
      success: true,
      data: {
        ...planData,
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error in generateFitnessPlan:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate fitness plan'
    });
  }
};

const generateDietSuggestion = async (req, res) => {
  try {
    console.log('🍎 Generating diet suggestion');
    
    const { mealType, dietaryPreferences, calories } = req.body;

    const suggestion = `
🍽️ ${(mealType || 'MEAL').toUpperCase()} SUGGESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dietary Preference: ${dietaryPreferences || 'Balanced'}
Target Calories: ~${calories || 500} kcal

RECOMMENDED MEAL:
• Protein: Grilled chicken breast (200g)
• Carbs: Brown rice (150g cooked)
• Vegetables: Mixed steamed vegetables
• Healthy Fats: Olive oil drizzle

MACROS:
Protein: 45g | Carbs: 55g | Fats: 12g
Total: ~${calories || 500} calories

Generated by FITSPHERE AI
    `;

    res.json({
      success: true,
      data: { suggestion }
    });

  } catch (error) {
    console.error('❌ Error generating diet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate diet suggestion'
    });
  }
};

module.exports = {
  generateFitnessPlan,
  generateDietSuggestion
};
