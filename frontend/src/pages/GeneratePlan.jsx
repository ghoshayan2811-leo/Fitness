import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { aiAPI } from '../services/api';

const GeneratePlan = () => {
  const { user, loading: userLoading } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const isProfileComplete = user?.age && user?.weight && user?.height && user?.gender;

  const [preferences, setPreferences] = useState({
    goal: user?.goal || 'weight_loss',
    activityLevel: user?.activityLevel || 'moderate',
    dietaryRestrictions: '',
    focusArea: 'full_body',
    duration: '4_weeks',
  });

  const loadSavedPlans = async () => {
    if (user && isProfileComplete) {
      try {
        setHistoryLoading(true);
        const response = await aiAPI.getPlans();
        if (response.data.success) {
          setSavedPlans(response.data.data || []);
          console.log('✅ Loaded plans:', response.data.data);
        }
      } catch (error) {
        console.error('❌ Failed to load plans:', error);
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSavedPlans();
  }, [user, isProfileComplete]);

  useEffect(() => {
    if (user) {
      setPreferences((prev) => ({
        ...prev,
        goal: user.goal || prev.goal,
        activityLevel: user.activityLevel || prev.activityLevel,
      }));
    }
  }, [user]);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();

    if (!isProfileComplete) {
      setError('Please complete your profile first');
      return;
    }

    setError('');
    setLoading(true);
    setCurrentPlan(null);

    try {
      const planData = {
        ...preferences,
        age: parseInt(user.age),
        weight: parseFloat(user.weight),
        height: parseFloat(user.height),
        gender: user.gender,
      };

      console.log('🤖 Generating plan:', planData);
      const response = await aiAPI.generatePlan(planData);

      if (!response.data?.data?.plan) {
        throw new Error('Invalid response');
      }

      console.log('✅ Plan generated:', response.data.data);
      setCurrentPlan(response.data.data);
      
      await loadSavedPlans();
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to generate plan'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      setDeletingId(planId);
      await aiAPI.deletePlan(planId);
      setSavedPlans(savedPlans.filter(p => p._id !== planId));
      console.log('✅ Plan deleted:', planId);
    } catch (error) {
      console.error('❌ Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (plan) => {
    if (!plan?.plan) return;
    const element = document.createElement('a');
    const file = new Blob([plan.plan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `fitsphere-plan-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-4" style={{ borderColor: '#00f2ea' }}></div>
          <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-16"
            style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #f59e0b',
            }}>
            <div className="text-7xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
              Profile Incomplete
            </h2>
            <p className="text-lg mb-6" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              Please complete your profile to generate personalized fitness plans
            </p>
            <Link to="/settings" className="inline-block btn-gradient px-8 py-4 text-lg font-bold">
              Complete Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            AI-Powered Fitness Plan Generator
          </h1>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Get personalized workout and nutrition plans based on your profile
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
            {showHistory ? `📋 Plan History (${savedPlans.length})` : 'Generate New Plan'}
          </h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-outline px-4 py-2"
          >
            {showHistory ? '🆕 New Plan' : '📋 View History'}
          </button>
        </div>

        {!showHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card"
              style={{
                backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
                Your Profile
              </h3>

              <div className="mb-6 p-4 rounded-lg"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 242, 234, 0.1)' : 'rgba(243, 244, 246, 1)',
                }}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Age:</span>
                    <span className="ml-2 font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                      {user?.age || 'N/A'} years
                    </span>
                  </div>
                  <div>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Gender:</span>
                    <span className="ml-2 font-semibold capitalize" style={{ color: isDark ? '#fff' : '#000' }}>
                      {user?.gender || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Weight:</span>
                    <span className="ml-2 font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                      {user?.weight || 'N/A'} kg
                    </span>
                  </div>
                  <div>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Height:</span>
                    <span className="ml-2 font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                      {user?.height || 'N/A'} cm
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleGeneratePlan} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    🎯 Primary Goal
                  </label>
                  <select
                    value={preferences.goal}
                    onChange={(e) => setPreferences({ ...preferences, goal: e.target.value })}
                    className="input-field"
                  >
                    <option value="weight_loss">🔥 Weight Loss</option>
                    <option value="muscle_gain">💪 Muscle Gain</option>
                    <option value="maintenance">⚖️ Maintenance</option>
                    <option value="endurance">🏃 Improve Endurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    🏋️ Activity Level
                  </label>
                  <select
                    value={preferences.activityLevel}
                    onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value })}
                    className="input-field"
                  >
                    <option value="sedentary">😴 Sedentary</option>
                    <option value="light">🚶 Light</option>
                    <option value="moderate">🏃 Moderate</option>
                    <option value="active">💪 Active</option>
                    <option value="very_active">🔥 Very Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    🎪 Focus Area
                  </label>
                  <select
                    value={preferences.focusArea}
                    onChange={(e) => setPreferences({ ...preferences, focusArea: e.target.value })}
                    className="input-field"
                  >
                    <option value="full_body">🧍 Full Body</option>
                    <option value="chest">💪 Chest & Arms</option>
                    <option value="legs">🦵 Legs & Glutes</option>
                    <option value="back">🏋️ Back & Shoulders</option>
                    <option value="core">🎯 Core & Abs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    ⏱️ Plan Duration
                  </label>
                  <select
                    value={preferences.duration}
                    onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
                    className="input-field"
                  >
                    <option value="2_weeks">2 Weeks</option>
                    <option value="4_weeks">4 Weeks (Recommended)</option>
                    <option value="8_weeks">8 Weeks</option>
                    <option value="12_weeks">12 Weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    🍎 Dietary Restrictions (Optional)
                  </label>
                  <input
                    type="text"
                    value={preferences.dietaryRestrictions}
                    onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Vegetarian, Gluten-free"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isProfileComplete}
                  className="w-full btn-gradient py-4 text-lg font-bold disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    '🤖 Generate My Personalized Plan'
                  )}
                </button>
              </form>
            </div>

            <div className="lg:sticky lg:top-8 self-start">
              {!currentPlan && !loading && (
                <div className="card text-center py-16"
                  style={{
                    backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }}>
                  <div className="text-7xl mb-6">📋</div>
                  <h3 className="text-2xl font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
                    Your Plan Will Appear Here
                  </h3>
                  <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Fill out your preferences and click "Generate"
                  </p>
                </div>
              )}

              {loading && (
                <div className="card text-center py-16"
                  style={{
                    backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }}>
                  <div className="inline-block animate-spin rounded-full h-24 w-24 border-b-4 mb-8" style={{ borderColor: '#00f2ea' }}></div>
                  <h3 className="text-2xl font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
                    Creating Your Plan...
                  </h3>
                </div>
              )}

              {currentPlan && (
                <div className="space-y-6">
                  <div className="card text-white shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #00f2ea, #00b8b8)' }}>
                    <h3 className="text-xl font-bold mb-4">✅ Plan Generated & Saved!</h3>
                    <p className="text-sm opacity-90 mb-2">
                      Created: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm opacity-90">
                      Duration: {preferences.duration.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="card shadow-xl"
                    style={{
                      backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                    }}>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2"
                      style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                      <h3 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                        Your Fitness Plan
                      </h3>
                      <button
                        onClick={() => handleDownload(currentPlan)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                        style={{
                          backgroundColor: isDark ? 'rgba(0, 242, 234, 0.2)' : 'rgba(219, 234, 254, 1)',
                          color: '#00f2ea'
                        }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      {currentPlan.plan.split('\n\n').map((section, index) =>
                        section.trim() && (
                          <div key={index} className="p-4 rounded-lg"
                            style={{ backgroundColor: isDark ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}>
                            <p className="whitespace-pre-wrap">{section}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card"
            style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                📋 Saved Plans History
              </h3>
              <button
                onClick={loadSavedPlans}
                disabled={historyLoading}
                className="btn-outline px-4 py-2 text-sm"
              >
                {historyLoading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>

            {historyLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-4" style={{ borderColor: '#00f2ea' }}></div>
                <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>Loading plans...</p>
              </div>
            ) : savedPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  No saved plans yet. Generate your first plan!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPlans.map((plan, index) => (
                  <div
                    key={plan._id || index}
                    className="p-6 border-2 rounded-lg"
                    style={{
                      borderColor: isDark ? 'rgba(0, 242, 234, 0.3)' : '#e5e7eb',
                      backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : '#fff',
                    }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2"
                          style={{ color: isDark ? '#00f2ea' : '#0369a1' }}>
                          Plan #{savedPlans.length - index}
                        </h4>
                        <p className="text-sm mb-2"
                          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          Created: {new Date(plan.createdAt).toLocaleDateString()} at {new Date(plan.createdAt).toLocaleTimeString()}
                        </p>
                        {plan.parameters && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: isDark ? 'rgba(0, 242, 234, 0.2)' : 'rgba(219, 234, 254, 1)',
                                color: '#00f2ea'
                              }}>
                              Goal: {plan.parameters.goal?.replace('_', ' ') || 'N/A'}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(209, 250, 229, 1)',
                                color: '#10b981'
                              }}>
                              Duration: {plan.parameters.duration?.replace('_', ' ') || 'N/A'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentPlan(plan);
                            setShowHistory(false);
                          }}
                          className="btn-outline px-4 py-2 text-sm">
                          View
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan._id)}
                          disabled={deletingId === plan._id}
                          className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50">
                          {deletingId === plan._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePlan;
