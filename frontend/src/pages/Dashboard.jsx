import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { aiAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await aiAPI.getPlans();
          if (response.data.success) {
            setSavedPlans(response.data.data || []);
          }
        } catch (error) {
          console.error('Failed to load plans:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPlans();
  }, [user]);

  const handleDownloadPlan = (plan) => {
    const element = document.createElement('a');
    const file = new Blob([plan.plan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `fitsphere-plan-${new Date(plan.createdAt).toLocaleDateString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Track your fitness journey and achieve your goals with FITSPHERE
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-white shadow-xl" style={{
            background: 'linear-gradient(135deg, #00f2ea, #00b8b8)'
          }}>
            <h3 className="text-lg font-semibold mb-2">Total Plans</h3>
            <p className="text-4xl font-bold">{savedPlans.length}</p>
            <p className="text-sm mt-2 opacity-90">AI-generated fitness plans</p>
          </div>

          <div className="card text-white shadow-xl" style={{
            background: 'linear-gradient(135deg, #10b981, #059669)'
          }}>
            <h3 className="text-lg font-semibold mb-2">Calories Burned</h3>
            <p className="text-4xl font-bold">0</p>
            <p className="text-sm mt-2 opacity-90">kcal this week</p>
          </div>

          <div className="card text-white shadow-xl" style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)'
          }}>
            <h3 className="text-lg font-semibold mb-2">Active Days</h3>
            <p className="text-4xl font-bold">0</p>
            <p className="text-sm mt-2 opacity-90">Keep it up!</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <div className="card shadow-xl" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white shadow-lg" style={{
                  background: 'linear-gradient(135deg, #00f2ea, #00b8b8)'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                  {user?.name}
                </h2>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {user?.email}
                </p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{
                    backgroundColor: isDark ? 'rgba(0, 242, 234, 0.1)' : 'rgba(243, 244, 246, 1)'
                  }}>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>User ID:</span>
                    <span className="text-sm font-mono" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      {user?.userId?.slice(0, 8)}...
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{
                    backgroundColor: isDark ? 'rgba(0, 242, 234, 0.1)' : 'rgba(243, 244, 246, 1)'
                  }}>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Member Since:</span>
                    <span className="text-sm font-semibold" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      2025
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/settings" className="block w-full btn-outline py-3">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <div className="card shadow-xl" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Generate AI Plan */}
                <Link 
                  to="/generate-plan" 
                  className="p-6 border-2 rounded-xl transition-all duration-300 text-left hover:scale-105 hover:shadow-lg block" 
                  style={{
                    borderColor: isDark ? 'rgba(0, 242, 234, 0.3)' : '#e5e7eb',
                    backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : '#fff'
                  }}
                >
                  <div className="text-3xl mb-2">🤖</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: isDark ? '#00f2ea' : '#0369a1' }}>
                    Generate AI Plan
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Get personalized diet and workout recommendations
                  </p>
                </Link>

                {/* Track Progress */}
                <Link 
                  to="/progress" 
                  className="p-6 border-2 rounded-xl transition-all duration-300 text-left hover:scale-105 hover:shadow-lg block" 
                  style={{
                    borderColor: isDark ? 'rgba(0, 242, 234, 0.3)' : '#e5e7eb',
                    backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : '#fff'
                  }}
                >
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: isDark ? '#00f2ea' : '#0369a1' }}>
                    Track Progress
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Log your daily meals and workouts
                  </p>
                </Link>

                {/* View Reports */}
                <button 
                  onClick={() => setShowReportsModal(true)}
                  className="p-6 border-2 rounded-xl transition-all duration-300 text-left hover:scale-105 hover:shadow-lg" 
                  style={{
                    borderColor: isDark ? 'rgba(0, 242, 234, 0.3)' : '#e5e7eb',
                    backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : '#fff'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">📈</div>
                    {savedPlans.length > 0 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {savedPlans.length}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: isDark ? '#00f2ea' : '#0369a1' }}>
                    View Reports
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    See your saved AI fitness plans
                  </p>
                </button>

                {/* Payment */}
                <Link 
                  to="/payment" 
                  className="p-6 border-2 rounded-xl transition-all duration-300 text-left hover:scale-105 hover:shadow-lg block relative" 
                  style={{
                    borderColor: isDark ? 'rgba(251, 191, 36, 0.3)' : '#fbbf24',
                    backgroundColor: isDark ? 'rgba(251, 191, 36, 0.05)' : '#fffbeb'
                  }}
                >
                  <span className="absolute top-2 right-2 bg-yellow-500 text-xs text-black px-2 py-1 rounded-full font-bold">
                    Premium
                  </span>
                  <div className="text-3xl mb-2">💳</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: isDark ? '#fbbf24' : '#d97706' }}>
                    Go Premium
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Unlock all features and advanced plans
                  </p>
                </Link>

              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="card shadow-xl" style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: isDark ? '#fff' : '#000' }}>
                <span className="text-2xl mr-2">🚀</span>
                Coming Soon Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start p-3 rounded-lg transition-colors hover:bg-opacity-50" style={{
                  backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : 'rgba(243, 244, 246, 0.5)'
                }}>
                  <span className="text-xl mr-3" style={{ color: '#00b8b8' }}>✓</span>
                  <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Advanced nutrition tracking with macros
                  </span>
                </li>
                <li className="flex items-start p-3 rounded-lg transition-colors hover:bg-opacity-50" style={{
                  backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : 'rgba(243, 244, 246, 0.5)'
                }}>
                  <span className="text-xl mr-3" style={{ color: '#00b8b8' }}>✓</span>
                  <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Video workout tutorials
                  </span>
                </li>
                <li className="flex items-start p-3 rounded-lg transition-colors hover:bg-opacity-50" style={{
                  backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : 'rgba(243, 244, 246, 0.5)'
                }}>
                  <span className="text-xl mr-3" style={{ color: '#00b8b8' }}>✓</span>
                  <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Progress charts and analytics
                  </span>
                </li>
                <li className="flex items-start p-3 rounded-lg transition-colors hover:bg-opacity-50" style={{
                  backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : 'rgba(243, 244, 246, 0.5)'
                }}>
                  <span className="text-xl mr-3" style={{ color: '#00b8b8' }}>✓</span>
                  <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Meal prep recommendations
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA Card */}
            <div className="card shadow-xl" style={{
              background: isDark 
                ? 'linear-gradient(135deg, rgba(0, 242, 234, 0.1), rgba(0, 184, 184, 0.1))'
                : 'linear-gradient(135deg, rgba(219, 234, 254, 1), rgba(221, 214, 254, 1))',
              border: `2px solid ${isDark ? 'rgba(0, 242, 234, 0.3)' : 'rgba(147, 197, 253, 1)'}`
            }}>
              <div className="text-center py-6">
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
                  Ready to Start Your Journey?
                </h3>
                <p className="mb-6" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  Get your personalized AI-powered fitness plan and track your progress!
                </p>
                <Link to="/generate-plan" className="inline-block btn-gradient px-8 py-3 font-bold shadow-lg">
                  Generate My Plan →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowReportsModal(false)}>
          <div className="card max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isDark ? 'rgba(17, 17, 17, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)'
            }}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2"
              style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              <h2 className="text-2xl font-bold flex items-center" style={{ color: isDark ? '#fff' : '#000' }}>
                <span className="text-3xl mr-3">📈</span>
                Your Saved Plans
              </h2>
              <button
                onClick={() => setShowReportsModal(false)}
                className="text-3xl hover:opacity-70 transition"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                ×
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-4"
                  style={{ borderColor: '#00f2ea' }}></div>
                <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>Loading your plans...</p>
              </div>
            ) : savedPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-7xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
                  No Plans Yet
                </h3>
                <p className="mb-6" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Generate your first AI fitness plan to see it here!
                </p>
                <Link to="/generate-plan" className="inline-block btn-gradient px-6 py-3 font-bold"
                  onClick={() => setShowReportsModal(false)}>
                  Generate Plan Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPlans.map((plan, index) => (
                  <div
                    key={plan._id || index}
                    className="p-6 border-2 rounded-lg transition-all hover:shadow-lg"
                    style={{
                      borderColor: isDark ? 'rgba(0, 242, 234, 0.3)' : '#e5e7eb',
                      backgroundColor: isDark ? 'rgba(0, 242, 234, 0.05)' : '#fff'
                    }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2"
                          style={{ color: isDark ? '#00f2ea' : '#0369a1' }}>
                          Plan #{savedPlans.length - index}
                        </h4>
                        <p className="text-sm mb-1"
                          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          Created: {new Date(plan.createdAt).toLocaleDateString()} at {new Date(plan.createdAt).toLocaleTimeString()}
                        </p>
                        {plan.parameters && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs px-3 py-1 rounded-full font-semibold"
                              style={{
                                backgroundColor: isDark ? 'rgba(0, 242, 234, 0.2)' : 'rgba(219, 234, 254, 1)',
                                color: '#00f2ea'
                              }}>
                              {plan.parameters.goal?.replace('_', ' ').toUpperCase() || 'N/A'}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full font-semibold"
                              style={{
                                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(209, 250, 229, 1)',
                                color: '#10b981'
                              }}>
                              {plan.parameters.duration?.replace('_', ' ') || 'N/A'}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownloadPlan(plan)}
                        className="px-4 py-2 text-sm rounded-lg font-semibold transition hover:opacity-80"
                        style={{
                          backgroundColor: isDark ? 'rgba(0, 242, 234, 0.2)' : 'rgba(219, 234, 254, 1)',
                          color: '#00f2ea'
                        }}>
                        Download
                      </button>
                    </div>
                    {plan.plan && (
                      <div className="mt-4 p-4 rounded-lg max-h-40 overflow-y-auto text-sm"
                        style={{
                          backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)',
                          color: isDark ? '#d1d5db' : '#374151'
                        }}>
                        <pre className="whitespace-pre-wrap font-sans">
                          {plan.plan.substring(0, 300)}...
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
