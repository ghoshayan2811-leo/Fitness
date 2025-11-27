import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-[var(--theme-bg-primary)] shadow-lg sticky top-0 z-50 border-b border-[var(--theme-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">🏋️</span>
              <span className="text-[var(--theme-text-primary)] text-2xl font-bold tracking-wide bg-gradient-to-r from-[#00f2ea] to-[#00b8b8] bg-clip-text text-transparent">
                FITSPHERE
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-[#00f2ea] to-[#00b8b8] text-black shadow-lg' 
                  : 'text-[var(--theme-text-secondary)] hover:bg-gray-800 hover:text-white'
              }`}
            >
              Home
            </Link>
            
            {!user && (
              <Link
                to="/trial"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive('/trial') 
                    ? 'bg-gradient-to-r from-[#00f2ea] to-[#00b8b8] text-black shadow-lg' 
                    : 'text-[var(--theme-text-secondary)] hover:bg-gray-800 hover:text-white'
                }`}
              >
                Try Free
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-gradient-to-r from-[#00f2ea] to-[#00b8b8] text-black shadow-lg' 
                      : 'text-[var(--theme-text-secondary)] hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-[var(--theme-text-secondary)] text-sm font-semibold hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-5 py-2 bg-gradient-to-r from-[#00f2ea] to-[#00b8b8] text-black rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-3 p-2 rounded-lg bg-gray-800 text-yellow-400 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 text-yellow-400"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[var(--theme-text-secondary)]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--theme-bg-secondary)] border-t border-[var(--theme-border)]">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {/* Same mobile menu items with CSS variable classes */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
