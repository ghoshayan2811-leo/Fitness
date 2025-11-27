import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Progress = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  
  const [activeTab, setActiveTab] = useState('workout'); // workout, nutrition, stats
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Sample workout data (later connect to AI backend)
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Push-ups', sets: 3, reps: 15, completed: false },
    { id: 2, name: 'Squats', sets: 4, reps: 20, completed: false },
    { id: 3, name: 'Plank', sets: 3, reps: '60s', completed: false },
    { id: 4, name: 'Running', sets: 1, reps: '5km', completed: false },
  ]);

  const [meals, setMeals] = useState([
    { id: 1, type: 'breakfast', name: '', calories: 0, logged: false },
    { id: 2, type: 'lunch', name: '', calories: 0, logged: false },
    { id: 3, type: 'dinner', name: '', calories: 0, logged: false },
    { id: 4, type: 'snacks', name: '', calories: 0, logged: false },
  ]);

  const [dailyStats, setDailyStats] = useState({
    weight: '',
    water: 0,
    sleep: 0,
    steps: 0,
  });

  // Toggle workout completion
  const toggleWorkout = (id) => {
    setWorkouts(workouts.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    ));
  };

  // Update meal
  const updateMeal = (id, field, value) => {
    setMeals(meals.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Calculate progress
  const workoutProgress = (workouts.filter(w => w.completed).length / workouts.length) * 100;
  const mealsLogged = meals.filter(m => m.logged).length;
  const totalCalories = meals.reduce((sum, m) => sum + (m.logged ? m.calories : 0), 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Track Your Progress</h1>
          <p className="text-xl" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Log your daily activities and monitor your fitness journey
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-6 card" style={{
          backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                📅 Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            <div className="text-right">
              <div className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Today's Progress</div>
              <div className="text-3xl font-bold gradient-text">{Math.round(workoutProgress)}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('workout')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'workout' ? 'btn-gradient' : 'btn-outline'
            }`}
          >
            💪 Workouts
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'nutrition' ? 'btn-gradient' : 'btn-outline'
            }`}
          >
            🍎 Nutrition
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stats' ? 'btn-gradient' : 'btn-outline'
            }`}
          >
            📊 Daily Stats
          </button>
        </div>

        {/* WORKOUT TAB */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            
            {/* Progress Bar */}
            <div className="card" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                Workout Progress
              </h3>
              <div className="w-full rounded-full h-4 mb-2" style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}>
                <div 
                  className="h-4 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${workoutProgress}%`,
                    background: 'linear-gradient(135deg, #00f2ea, #00b8b8)'
                  }}
                ></div>
              </div>
              <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {workouts.filter(w => w.completed).length} of {workouts.length} exercises completed
              </p>
            </div>

            {/* Workout List */}
            <div className="card" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                Today's Exercises
              </h3>
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 rounded-lg transition-all hover:scale-102"
                    style={{
                      backgroundColor: workout.completed 
                        ? (isDark ? 'rgba(0, 242, 234, 0.1)' : 'rgba(219, 234, 254, 1)')
                        : (isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'),
                      border: `2px solid ${workout.completed ? '#00f2ea' : 'transparent'}`
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleWorkout(workout.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          workout.completed ? 'bg-[#00f2ea] border-[#00f2ea]' : 'border-gray-400'
                        }`}
                      >
                        {workout.completed && (
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${workout.completed ? 'line-through' : ''}`} 
                            style={{ color: isDark ? '#fff' : '#000' }}>
                          {workout.name}
                        </h4>
                        <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          {workout.sets} sets × {workout.reps} reps
                        </p>
                      </div>
                    </div>
                    {workout.completed && (
                      <span className="text-2xl">✅</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            
            {/* Calorie Summary */}
            <div className="card text-white shadow-xl" style={{
              background: 'linear-gradient(135deg, #00f2ea, #00b8b8)'
            }}>
              <h3 className="text-xl font-bold mb-4">Calorie Tracker</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90">Total Consumed</p>
                  <p className="text-3xl font-bold">{totalCalories}</p>
                  <p className="text-xs opacity-75">kcal</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Meals Logged</p>
                  <p className="text-3xl font-bold">{mealsLogged}/4</p>
                  <p className="text-xs opacity-75">meals</p>
                </div>
              </div>
            </div>

            {/* Meal Logging */}
            <div className="card" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                Log Your Meals
              </h3>
              <div className="space-y-4">
                {meals.map((meal) => (
                  <div key={meal.id} className="p-4 rounded-lg" style={{
                    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
                  }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold capitalize" style={{ color: isDark ? '#00f2ea' : '#0369a1' }}>
                        {meal.type === 'breakfast' && '🌅 Breakfast'}
                        {meal.type === 'lunch' && '🌞 Lunch'}
                        {meal.type === 'dinner' && '🌙 Dinner'}
                        {meal.type === 'snacks' && '🍿 Snacks'}
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={meal.logged}
                          onChange={(e) => updateMeal(meal.id, 'logged', e.target.checked)}
                          className="w-5 h-5 rounded accent-[#00f2ea]"
                        />
                        <span className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Logged</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="What did you eat?"
                        value={meal.name}
                        onChange={(e) => updateMeal(meal.id, 'name', e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Calories"
                        value={meal.calories || ''}
                        onChange={(e) => updateMeal(meal.id, 'calories', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DAILY STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            
            <div className="card" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
                Daily Health Metrics
              </h3>
              
              <div className="space-y-6">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    ⚖️ Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter your weight"
                    value={dailyStats.weight}
                    onChange={(e) => setDailyStats({...dailyStats, weight: e.target.value})}
                    className="input-field"
                  />
                </div>

                {/* Water Intake */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    💧 Water Intake (glasses)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={dailyStats.water}
                      onChange={(e) => setDailyStats({...dailyStats, water: parseInt(e.target.value)})}
                      className="flex-1"
                      style={{ accentColor: '#00f2ea' }}
                    />
                    <span className="text-2xl font-bold" style={{ color: '#00f2ea' }}>
                      {dailyStats.water}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full"
                        style={{
                          backgroundColor: i < dailyStats.water ? '#00f2ea' : (isDark ? '#374151' : '#e5e7eb')
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Sleep */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    😴 Sleep (hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    placeholder="Hours of sleep"
                    value={dailyStats.sleep}
                    onChange={(e) => setDailyStats({...dailyStats, sleep: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>

                {/* Steps */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    👟 Steps
                  </label>
                  <input
                    type="number"
                    placeholder="Steps walked today"
                    value={dailyStats.steps}
                    onChange={(e) => setDailyStats({...dailyStats, steps: parseInt(e.target.value) || 0})}
                    className="input-field"
                  />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Goal: 10,000 steps
                  </p>
                  <div className="w-full rounded-full h-2 mt-2" style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}>
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((dailyStats.steps / 10000) * 100, 100)}%`,
                        background: 'linear-gradient(135deg, #00f2ea, #00b8b8)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <button className="w-full btn-gradient mt-6">
                💾 Save Today's Stats
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Progress;
