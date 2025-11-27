import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { authAPI } from '../services/api';

const Settings = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form - Initialize with user data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    gender: user?.gender || 'male',
    goal: user?.goal || 'weight_loss',
    activityLevel: user?.activityLevel || 'moderate'
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || 'male',
        goal: user.goal || 'weight_loss',
        activityLevel: user.activityLevel || 'moderate'
      });
    }
  }, [user]);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    workoutReminders: true,
    weeklyReports: true,
    darkMode: isDark,
    measurementUnit: 'metric'
  });

  // Delete Account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ Update Profile - Matches Signup structure exactly
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // ✅ Send data matching EXACT signup structure
      const updateData = {
        name: profileData.name,
        age: profileData.age,
        weight: profileData.weight,
        height: profileData.height,
        gender: profileData.gender,
        goal: profileData.goal,
        activityLevel: profileData.activityLevel
      };

      console.log('📤 Updating profile with:', updateData);
      
      await updateProfile(updateData);
      setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
    } catch (error) {
      console.error('❌ Update error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to update profile';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '❌ Passwords do not match!' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '❌ Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword(passwordData);
      setMessage({ type: 'success', text: '✅ Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to change password';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  // Update Preferences
  const handleUpdatePreferences = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Update theme if changed
      if (preferences.darkMode !== isDark) {
        toggleTheme();
      }
      
      setMessage({ type: 'success', text: '✅ Preferences saved!' });
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to save preferences' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setMessage({ type: 'error', text: '❌ Please type DELETE to confirm' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.deleteAccount();
      logout();
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete account';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Settings</h1>
          <p className="text-xl" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Manage your account and preferences
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'profile' ? 'btn-gradient' : 'btn-outline'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'password' ? 'btn-gradient' : 'btn-outline'
            }`}
          >
            🔒 Password
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'preferences' ? 'btn-gradient' : 'btn-outline'
            }`}
          >
            ⚙️ Preferences
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'danger' ? 'bg-red-500 text-white' : 'btn-outline'
            }`}
          >
            ⚠️ Danger Zone
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="card" style={{
            backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
              Profile Information
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="input-field"
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p className="text-xs mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Email cannot be changed
                  </p>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    className="input-field"
                    min="10"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Gender
                  </label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    className="input-field"
                  >
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">⚧️ Other</option>
                  </select>
                </div>
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                    className="input-field"
                    step="0.1"
                    min="30"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                    className="input-field"
                    min="100"
                    max="250"
                  />
                </div>
              </div>

              {/* Goal & Activity Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Fitness Goal
                  </label>
                  <select
                    value={profileData.goal}
                    onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
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
                    Activity Level
                  </label>
                  <select
                    value={profileData.activityLevel}
                    onChange={(e) => setProfileData({...profileData, activityLevel: e.target.value})}
                    className="input-field"
                  >
                    <option value="sedentary">😴 Sedentary</option>
                    <option value="light">🚶 Light</option>
                    <option value="moderate">🏃 Moderate</option>
                    <option value="active">💪 Active</option>
                    <option value="very_active">🔥 Very Active</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'password' && (
          <div className="card" style={{
            backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
              Change Password
            </h2>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="input-field"
                  required
                  minLength="6"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing...' : '🔒 Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="card" style={{
            backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
              Preferences
            </h2>
            
            <div className="space-y-6">
              
              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
              }}>
                <div>
                  <h3 className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                    🌓 Dark Mode
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Toggle dark/light theme
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={(e) => setPreferences({...preferences, darkMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00f2ea]"></div>
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
              }}>
                <div>
                  <h3 className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                    📧 Email Notifications
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Receive updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00f2ea]"></div>
                </label>
              </div>

              {/* Workout Reminders */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
              }}>
                <div>
                  <h3 className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                    ⏰ Workout Reminders
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Get daily workout reminders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.workoutReminders}
                    onChange={(e) => setPreferences({...preferences, workoutReminders: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00f2ea]"></div>
                </label>
              </div>

              {/* Weekly Reports */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
              }}>
                <div>
                  <h3 className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                    📊 Weekly Reports
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Receive weekly progress reports
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.weeklyReports}
                    onChange={(e) => setPreferences({...preferences, weeklyReports: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00f2ea]"></div>
                </label>
              </div>

              {/* Measurement Unit */}
              <div className="p-4 rounded-lg" style={{
                backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
              }}>
                <h3 className="font-semibold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                  📏 Measurement Unit
                </h3>
                <select
                  value={preferences.measurementUnit}
                  onChange={(e) => setPreferences({...preferences, measurementUnit: e.target.value})}
                  className="input-field"
                >
                  <option value="metric">Metric (kg, cm)</option>
                  <option value="imperial">Imperial (lbs, inches)</option>
                </select>
              </div>

              <button
                onClick={handleUpdatePreferences}
                disabled={loading}
                className="w-full btn-gradient py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : '💾 Save Preferences'}
              </button>
            </div>
          </div>
        )}

        {/* DANGER ZONE TAB */}
        {activeTab === 'danger' && (
          <div className="card border-2 border-red-500" style={{
            backgroundColor: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-2xl font-bold mb-2 text-red-500">
              ⚠️ Danger Zone
            </h2>
            <p className="mb-6" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              Irreversible and destructive actions
            </p>
            
            <div className="p-6 border-2 border-red-300 rounded-lg bg-red-50">
              <h3 className="text-xl font-bold mb-2 text-red-700">
                Delete Account
              </h3>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. All your data will be permanently deleted.
              </p>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🗑️ Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full" style={{
              backgroundColor: isDark ? '#111' : '#fff'
            }}>
              <h3 className="text-2xl font-bold mb-4 text-red-500">
                ⚠️ Confirm Account Deletion
              </h3>
              <p className="mb-4" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <p className="mb-4 font-semibold" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                Type <span className="text-red-500">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="input-field mb-4"
                placeholder="Type DELETE"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirm('');
                  }}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
