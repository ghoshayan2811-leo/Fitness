import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { aiAPI } from '../services/api';

const Trial = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'weight_loss',
    activityLevel: 'moderate'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { isDark } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      if (!formData.age || !formData.weight || !formData.height) {
        throw new Error('Please fill in all required fields.');
      }

      const sendData = {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height)
      };

      console.log('🤖 Sending trial plan request:', sendData);
      const response = await aiAPI.generateTrialPlan(sendData);

      if (!response.data?.data?.plan) {
        throw new Error('Invalid response from backend.');
      }

      setResult(response.data.data);
    } catch (err) {
      console.error('❌ API error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to generate plan. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setFormData({
      age: '',
      weight: '',
      height: '',
      gender: 'male',
      goal: 'weight_loss',
      activityLevel: 'moderate'
    });
  };

  const handleDownload = () => {
    if (!result?.plan) return;
    const element = document.createElement('a');
    const file = new Blob([result.plan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `fitsphere-plan-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Free AI Fitness Plan Generator
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Get your personalized fitness and nutrition plan in seconds - No signup required!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="card"
            style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2"
              style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              <span className="text-3xl">📝</span>
              <h2 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                Enter Your Details
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Age (years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required min="10" max="100" className="input-field" placeholder="e.g., 25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="input-field">
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">⚧️ Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required min="30" max="300" step="0.1" className="input-field" placeholder="e.g., 70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required min="100" max="250" className="input-field" placeholder="e.g., 175"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  Fitness Goal <span className="text-red-500">*</span>
                </label>
                <select value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} className="input-field">
                  <option value="weight_loss">🔥 Weight Loss</option>
                  <option value="muscle_gain">💪 Muscle Gain</option>
                  <option value="maintenance">⚖️ Maintenance</option>
                  <option value="endurance">🏃 Improve Endurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  Activity Level <span className="text-red-500">*</span>
                </label>
                <select value={formData.activityLevel} onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })} className="input-field">
                  <option value="sedentary">😴 Sedentary</option>
                  <option value="light">🚶 Light</option>
                  <option value="moderate">🏃 Moderate</option>
                  <option value="active">💪 Active</option>
                  <option value="very_active">🔥 Very Active</option>
                </select>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full btn-gradient text-lg py-4 font-bold disabled:opacity-50"
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
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🤖</span>
                    Generate My Fitness Plan
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-lg"
              style={{
                backgroundColor: isDark ? 'rgba(0,242,234,0.1)' : 'rgba(219,234,254,1)',
                border: `1px solid ${isDark ? 'rgba(0,242,234,0.3)' : 'rgba(147,197,253,1)'}`
              }}>
              <p className="text-sm text-center" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                💡 Want to save? <a href="/signup" className="text-[#00f2ea] font-semibold underline">Create free account</a>
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 self-start">
            {!result && !loading && (
              <div className="card text-center py-16"
                style={{
                  backgroundColor: isDark ? 'rgba(17,17,17,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                <div className="text-7xl mb-6 animate-pulse">📋</div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
                  Your Plan Will Appear Here
                </h3>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Fill out the form and click "Generate"!
                </p>
              </div>
            )}

            {loading && (
              <div className="card text-center py-16"
                style={{
                  backgroundColor: isDark ? 'rgba(17,17,17,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                <div className="inline-block animate-spin rounded-full h-24 w-24 border-b-4 mb-8" style={{ borderColor: '#00f2ea' }}></div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
                  Creating Your Plan...
                </h3>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Analyzing your profile...
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {result.userInfo && (
                  <div className="card shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #00f2ea, #00b8b8)',
                      color: '#fff'
                    }}>
                    <h3 className="text-xl font-bold mb-4">✅ Your Profile</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-sm opacity-90">Age</p>
                        <p className="font-bold text-2xl">{result.userInfo.age}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-sm opacity-90">BMI</p>
                        <p className="font-bold text-2xl">{result.userInfo.bmi}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-sm opacity-90">Weight</p>
                        <p className="font-bold text-2xl">{result.userInfo.weight}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-sm opacity-90">Height</p>
                        <p className="font-bold text-2xl">{result.userInfo.height}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card shadow-xl"
                  style={{
                    backgroundColor: isDark ? 'rgba(17,17,17,0.95)' : 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                  }}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2"
                    style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                    <h3 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                      📋 Your Fitness Plan
                    </h3>
                    <button onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                      style={{
                        backgroundColor: isDark ? 'rgba(0, 242, 234, 0.2)' : 'rgba(219,234,254,1)',
                        color: '#00f2ea'
                      }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    {result.plan.split('\n\n').map((section, idx) =>
                      section.trim() ? (
                        <div key={idx} className="p-4 rounded-lg"
                          style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243,244,246,1)' }}>
                          <p className="whitespace-pre-wrap">{section}</p>
                        </div>
                      ) : null
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t-2 flex flex-col sm:flex-row gap-4"
                    style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                    <button onClick={handleReset} className="flex-1 btn-outline">
                      Generate New
                    </button>
                    <a href="/signup" className="flex-1 btn-gradient text-center">
                      Save This Plan
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trial;
