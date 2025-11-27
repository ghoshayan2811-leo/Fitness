import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Trigger animations on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.observe').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      
      {/* HERO SECTION */}
      <section className="hero-section relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="hero-title animate-fadeInLeft">
                Transform Your Body & Fitness
              </h1>
              <p className="hero-subtitle animate-fadeInLeft delay-200">
                Get personalized workout plans, nutrition guidance, and 24/7 AI coaching tailored specifically to your goals and lifestyle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInLeft delay-400">
                {user ? (
                  <Link to="/dashboard" className="btn-gradient">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/trial" className="btn-gradient">
                      Start Your Journey
                    </Link>
                    <Link to="/signup" className="btn-outline">
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 animate-fadeInLeft delay-600">
                <div className="text-center lg:text-left">
                  <div className="text-4xl font-bold gradient-text">10K+</div>
                  <div className="text-sm text-gray-400 mt-1">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-4xl font-bold gradient-text">500+</div>
                  <div className="text-sm text-gray-400 mt-1">Workouts</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-4xl font-bold gradient-text">4.9★</div>
                  <div className="text-sm text-gray-400 mt-1">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Animated Image/Illustration */}
            <div className="hidden lg:block animate-fadeInRight">
              <div className="relative animate-float">
                <div className="w-full h-[500px] rounded-3xl bg-gradient-to-br from-[#00f2ea]/20 to-[#00b8b8]/20 flex items-center justify-center shadow-glow backdrop-blur-sm">
                  <span className="text-9xl">🏋️</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 observe">
            <h2 className="section-title">Why Choose FITSPHERE?</h2>
            <p className="section-subtitle">
              Everything you need to achieve your fitness goals in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="feature-card observe delay-100">
              <div className="feature-icon">
                🤖
              </div>
              <h3 className="feature-title">AI-Powered Workouts</h3>
              <p className="feature-description">
                Get personalized workout plans that adapt to your progress, goals, and available equipment using advanced AI technology.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card observe delay-200">
              <div className="feature-icon">
                🍎
              </div>
              <h3 className="feature-title">Smart Nutrition</h3>
              <p className="feature-description">
                Custom meal plans with recipes tailored to your dietary preferences, fitness objectives, and health conditions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card observe delay-300">
              <div className="feature-icon">
                💬
              </div>
              <h3 className="feature-title">24/7 AI Coach</h3>
              <p className="feature-description">
                Access your virtual fitness coach anytime for guidance, motivation, form correction, and expert advice.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="section section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 observe">
            <h2 className="section-title">Our Premium Services</h2>
            <p className="section-subtitle">
              We provide everything you need to achieve your fitness goals and maintain a healthy lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="service-card observe delay-100">
              <div className="service-icon">📊</div>
              <h3 className="service-title">Progress Analytics</h3>
              <p className="service-description">
                Track your performance with detailed analytics and visual progress reports
              </p>
            </div>

            <div className="service-card observe delay-200">
              <div className="service-icon">🥗</div>
              <h3 className="service-title">Meal Planning</h3>
              <p className="service-description">
                Customized meal plans with grocery lists and nutritional information
              </p>
            </div>

            <div className="service-card observe delay-300">
              <div className="service-icon">🏆</div>
              <h3 className="service-title">Achievements</h3>
              <p className="service-description">
                Earn badges and rewards as you reach your fitness milestones
              </p>
            </div>

            <div className="service-card observe delay-400">
              <div className="service-icon">👥</div>
              <h3 className="service-title">Community</h3>
              <p className="service-description">
                Connect with like-minded individuals and share your journey
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="contact-heading observe">Get In Touch</h2>
          <p className="section-subtitle observe">
            Have questions or ready to begin your fitness journey? We're here to help!
          </p>

          {/* Contact Info Grid */}
          <div className="contact-grid">
            <div className="contact-item observe delay-100">
              <i className="fas fa-envelope"></i>
              <h3>Email</h3>
              <a href="mailto:support@fitsphere.com">support@fitsphere.com</a>
            </div>

            <div className="contact-item observe delay-200">
              <i className="fas fa-phone"></i>
              <h3>Phone</h3>
              <a href="tel:+919339394440">+91 93393 94440</a>
            </div>

            <div className="contact-item observe delay-300">
              <i className="fas fa-map-marker-alt"></i>
              <h3>Address</h3>
              <p>Kolkata, West Bengal, India</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form observe">
            <h3>Send Us a Message</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for your message! We will get back to you soon.');
              e.target.reset();
            }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength="3"
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength="10"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message <i className="fas fa-paper-plane ml-2"></i>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section section-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center observe">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already started their fitness journey
          </p>
          {!user && (
            <Link to="/signup" className="btn-gradient text-lg px-12 py-4 animate-pulse-glow">
              Get Started Now - It's Free!
            </Link>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
