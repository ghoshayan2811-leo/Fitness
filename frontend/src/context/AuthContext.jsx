import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      console.log('✅ User profile loaded from backend:', response.data);
      
      // Backend returns { success: true, user: {...} }
      setUser(response.data.user || response.data);
    } catch (error) {
      console.error('❌ Error loading user:', error);
      
      // Only logout if token is invalid (401 Unauthorized)
      if (error.response?.status === 401) {
        console.log('🔒 Token invalid, logging out...');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      console.log('🔵 Signup response:', response.data);
      
      const { token, user } = response.data;
      
      // Set everything immediately
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setLoading(false);
      
      console.log('✅ User state set:', user);
      return response.data;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      console.log('🔵 Login response:', response.data);
      
      const { token, user } = response.data;
      
      // Set everything immediately
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setLoading(false);
      
      console.log('✅ User state set:', user);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  // ✅ NEW - Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      console.log('✅ Profile updated:', response.data);
      
      // Update user state with new data
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  };

  // ✅ NEW - Refresh user data from backend
  const refreshUser = async () => {
    try {
      await loadUser();
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      logout, 
      signup, 
      loginUser,
      updateProfile,    // ✅ NEW - For Settings page
      refreshUser       // ✅ NEW - To manually refresh user data
    }}>
      {children}
    </AuthContext.Provider>
  );
};
