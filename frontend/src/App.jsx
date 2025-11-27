import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Trial from './pages/Trial';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import GeneratePlan from './pages/GeneratePlan';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const playMusic = () => {
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log('Autoplay blocked:', err));
        // Remove listener after first interaction
        document.removeEventListener('click', playMusic);
        document.removeEventListener('keydown', playMusic);
      }
    };

    // Play on first click or keypress
    document.addEventListener('click', playMusic);
    document.addEventListener('keydown', playMusic);

    return () => {
      document.removeEventListener('click', playMusic);
      document.removeEventListener('keydown', playMusic);
    };
  }, []);

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music');
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log('Play failed:', err));
      }
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {/* Background Music - Plays on first user interaction */}
          <audio 
            id="bg-music"
            src="/music.mp3" 
            loop 
            preload="auto"
          />

          {/* Music Control Button */}
          <button
            onClick={toggleMusic}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f2ea, #00b8b8)',
              border: 'none',
              color: '#000',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 242, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 242, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 242, 234, 0.4)';
            }}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          {/* Global Animated Background - stays behind everything */}
          <AnimatedBackground />
          
          <div className="min-h-screen flex flex-col relative z-10">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/trial" element={<Trial />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/generate-plan"
                  element={
                    <ProtectedRoute>
                      <GeneratePlan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
