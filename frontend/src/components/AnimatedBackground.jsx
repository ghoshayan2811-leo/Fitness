import { useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const AnimatedBackground = () => {
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    // Initialize particles.js when component mounts
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: isDark ? '#00f2ea' : '#00b8b8'
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: isDark ? 0.5 : 0.3,
            random: true
          },
          size: {
            value: 3,
            random: true
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: isDark ? '#00f2ea' : '#00b8b8',
            opacity: isDark ? 0.4 : 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }, [isDark]);

  return <div id="particles-js" className="animated-background" />;
};

export default AnimatedBackground;
