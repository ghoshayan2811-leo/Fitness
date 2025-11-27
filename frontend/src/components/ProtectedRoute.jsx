import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);

  // ✅ Show loading state while checking authentication
  if (loading) {
    console.log('⏳ ProtectedRoute: Loading user...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-4"
            style={{ borderColor: '#00f2ea' }}
          ></div>
          <p className="text-lg" style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ✅ If not authenticated, redirect to login
  if (!loading && !user) {
    console.log('❌ ProtectedRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // ✅ If authenticated, render the protected content
  console.log('✅ ProtectedRoute: User authenticated:', user?.name);
  return children;
};

export default ProtectedRoute;
