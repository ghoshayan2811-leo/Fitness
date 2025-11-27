import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { isDark } = useContext(ThemeContext);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for subscribing to our newsletter!');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* FOOTER */}
      <footer style={{
        backgroundColor: isDark ? '#000000' : '#f3f4f6',
        color: isDark ? '#ddd' : '#4b5563',
        borderTop: `1px solid ${isDark ? '#333' : '#e5e7eb'}`
      }} className="mt-20 pt-16 pb-8 transition-colors duration-300">
        <div className="footer-content">
          
          {/* About Section */}
          <div className="footer-section">
            <h3 style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}>About FITSPHERE</h3>
            <p style={{ color: isDark ? '#bbb' : '#6b7280' }}>
              Personalized workout and nutrition plans powered by AI to help you reach your fitness goals faster and smarter.
            </p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github" style={{ color: isDark ? '#fff' : '#374151' }}></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram" style={{ color: isDark ? '#fff' : '#374151' }}></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter" style={{ color: isDark ? '#fff' : '#374151' }}></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin" style={{ color: isDark ? '#fff' : '#374151' }}></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}>Quick Links</h3>
            <ul>
              <li>
                <Link 
                  to="/" 
                  onClick={scrollToTop}
                  style={{ color: isDark ? '#bbb' : '#6b7280' }}
                  className="hover:text-[#00f2ea] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/trial" 
                  onClick={scrollToTop}
                  style={{ color: isDark ? '#bbb' : '#6b7280' }}
                  className="hover:text-[#00f2ea] transition-colors"
                >
                  Free Trial
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  onClick={scrollToTop}
                  style={{ color: isDark ? '#bbb' : '#6b7280' }}
                  className="hover:text-[#00f2ea] transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  onClick={scrollToTop}
                  style={{ color: isDark ? '#bbb' : '#6b7280' }}
                  className="hover:text-[#00f2ea] transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  onClick={scrollToTop}
                  style={{ color: isDark ? '#bbb' : '#6b7280' }}
                  className="hover:text-[#00f2ea] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}>Contact Us</h3>
            <p style={{ color: isDark ? '#bbb' : '#6b7280' }}>
              <i className="fas fa-envelope" style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}></i>
              <a 
                href="mailto:support@fitsphere.com" 
                style={{ color: isDark ? '#bbb' : '#6b7280' }}
                className="hover:text-[#00f2ea] transition-colors"
              >
                support@fitsphere.com
              </a>
            </p>
            <p style={{ color: isDark ? '#bbb' : '#6b7280' }}>
              <i className="fas fa-phone" style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}></i>
              <a 
                href="tel:+919339394440"
                style={{ color: isDark ? '#bbb' : '#6b7280' }}
                className="hover:text-[#00f2ea] transition-colors"
              >
                +91 93393 94440
              </a>
            </p>
            <p style={{ color: isDark ? '#bbb' : '#6b7280' }}>
              <i className="fas fa-map-marker-alt" style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}></i>
              Kolkata, West Bengal, India
            </p>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3 style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}>Newsletter</h3>
            <p style={{ color: isDark ? '#bbb' : '#6b7280' }}>
              Subscribe for fitness tips, nutrition advice, and updates
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#333' : '#d1d5db'
                }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: isDark ? '#00f2ea' : '#00b8b8',
                  color: '#0a0a0a'
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div 
          className="footer-bottom"
          style={{
            borderTop: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
            color: isDark ? '#888' : '#6b7280'
          }}
        >
          <p>
            © 2025 FITSPHERE. All rights reserved. |{' '}
            <Link 
              to="/privacy" 
              style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}
              className="hover:underline transition-colors"
            >
              Privacy Policy
            </Link> |{' '}
            <Link 
              to="/terms"
              style={{ color: isDark ? '#00f2ea' : '#00b8b8' }}
              className="hover:underline transition-colors"
            >
              Terms of Service
            </Link>
          </p>
          <p className="mt-2 text-xs">
            Made with ❤️ for fitness enthusiasts worldwide
          </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        className="back-to-top visible"
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{
          background: 'linear-gradient(135deg, #00f2ea, #00b8b8)',
          color: '#0a0a0a'
        }}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
};

export default Footer;
