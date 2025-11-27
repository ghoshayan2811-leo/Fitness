import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser, user } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt with:', { email: formData.email });

    try {
      const response = await loginUser(formData);
      console.log('✅ Login successful!', response);
      console.log('✅ User after login:', user);
      
      // ✅ Small delay to ensure state updates
      setTimeout(() => {
        console.log('✅ Navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('❌ Login error - Full error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error message:', err.message);
      
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
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
            <div className="text-6xl mb-4">🏋️</div>
            <h2 className="text-3xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
              Welcome Back to FITSPHERE!
            </h2>
            <p className="mt-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Email Address
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
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-gradient"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[#00f2ea] hover:text-[#00b8b8]">
                Sign up
              </Link>
            </p>
            <Link to="/" className="block text-sm hover:text-[#00f2ea]" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
