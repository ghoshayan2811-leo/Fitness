import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'weight_loss',
    activityLevel: 'moderate'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, user } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill all fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setError('');
      setStep(2);
      return;
    }

    setError('');
    setLoading(true);

    console.log('🔵 Signup attempt with data:', formData);

    try {
      const response = await signup(formData);
      console.log('✅ Signup successful!', response);
      console.log('✅ User after signup:', user);
      
      // ✅ Small delay to ensure state updates
      setTimeout(() => {
        console.log('✅ Navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('❌ Signup error - Full error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error message:', err.message);
      
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card" style={{
          backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{step === 1 ? '🎯' : '💪'}</div>
            <h2 className="text-3xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
              {step === 1 ? 'Join FITSPHERE' : 'Complete Your Profile'}
            </h2>
            <p className="mt-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              {step === 1 ? 'Start your fitness journey today' : 'Help us personalize your experience'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                Step {step} of 2
              </span>
              <span className="text-sm font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {step === 1 ? 'Account' : 'Fitness Profile'}
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}>
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: step === 1 ? '50%' : '100%',
                  background: 'linear-gradient(135deg, #00f2ea, #00b8b8)'
                }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* STEP 1: Account Information */}
            {step === 1 && (
              <>
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#d1d5db' : '#374151' }}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#d1d5db' : '#374151' }}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#d1d5db' : '#374151' }}
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="6"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Minimum 6 characters
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full btn-gradient"
                >
                  Continue to Fitness Profile →
                </button>
              </>
            )}

            {/* STEP 2: Fitness Information */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDark ? '#d1d5db' : '#374151' }}
                    >
                      Age (years) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      min="10"
                      max="100"
                      className="input-field"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDark ? '#d1d5db' : '#374151' }}
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="input-field"
                    >
                      <option value="male">👨 Male</option>
                      <option value="female">👩 Female</option>
                      <option value="other">⚧️ Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDark ? '#d1d5db' : '#374151' }}
                    >
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      className="input-field"
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDark ? '#d1d5db' : '#374151' }}
                    >
                      Height (cm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      required
                      min="100"
                      max="250"
                      className="input-field"
                      placeholder="175"
                    />
                  </div>
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#d1d5db' : '#374151' }}
                  >
                    Fitness Goal <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="input-field"
                  >
                    <option value="weight_loss">🔥 Weight Loss</option>
                    <option value="muscle_gain">💪 Muscle Gain</option>
                    <option value="maintenance">⚖️ Maintenance</option>
                    <option value="endurance">🏃 Improve Endurance</option>
                  </select>
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#d1d5db' : '#374151' }}
                  >
                    Activity Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    className="input-field"
                  >
                    <option value="sedentary">😴 Sedentary (little/no exercise)</option>
                    <option value="light">🚶 Light (exercise 1-3 days/week)</option>
                    <option value="moderate">🏃 Moderate (exercise 3-5 days/week)</option>
                    <option value="active">💪 Active (exercise 6-7 days/week)</option>
                    <option value="very_active">🔥 Very Active (intense daily)</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 btn-outline"
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 btn-gradient"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Footer Links */}
          {step === 1 && (
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-[#00f2ea] hover:text-[#00b8b8] underline">
                  Sign in
                </Link>
              </p>
              <Link to="/" className="block text-sm hover:text-[#00f2ea]" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
