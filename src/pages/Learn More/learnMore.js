import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LearnMore.css'; // We'll extract the CSS separately

const LearnMore = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="learn-more-page">
      {/* ===== Header with Navbar ===== */}
      <header>
        <div className="navbar">
          <div className="hamburger" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <h1>e-GAS</h1>
          <div className="auth-buttons">
            <button className="signin-btn" onClick={() => window.location.href = '/login'}>
              Sign In
            </button>
            <button className="signup-btn" onClick={() => window.location.href = '/register'}>
              Sign Up
            </button>
          </div>
          <nav className={`nav-links ${menuActive ? 'active' : ''}`}>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
      </header>

      {/* ===== Page Header ===== */}
      <section className="page-header">
        <h2>Unlock Boundless Opportunities with e-GAS</h2>
        <p>
          Discover how e-GAS provides customized gas solutions for homes, businesses, and restaurants with our reliable delivery and innovative subscription plans.
        </p>
      </section>

      {/* ===== Opportunities Section ===== */}
      <section className="opportunities-section">
        <h2 className="section-title">Our Opportunities</h2>

        <div className="opportunity-cards">
          <div className="opportunity-card">
            <div className="card-img">
              <img
                src="https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Domestic Solutions"
              />
            </div>
            <div className="card-content">
              <h3>Domestic Solutions</h3>
              <p>
                Perfect for households of all sizes. Our domestic plans are designed to ensure you never run out of gas when you need it most.
              </p>
              <Link to="/domestic-learn-more" className="read-more">
                Learn More
              </Link>
            </div>
          </div>

          <div className="opportunity-card">
            <div className="card-img">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Restaurant Solutions"
              />
            </div>
            <div className="card-content">
              <h3>Restaurant Solutions</h3>
              <p>
                Specialized high-volume gas delivery for restaurants and food service businesses. Never worry about interrupting your service.
              </p>
              <Link to="/restaurant-learn-more" className="read-more">
                Learn More
              </Link>
            </div>
          </div>

          <div className="opportunity-card">
            <div className="card-img">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
                alt="Business Solutions"
              />
            </div>
            <div className="card-content">
              <h3>Business Solutions</h3>
              <p>
                Comprehensive gas supply plans for industries, manufacturing units, and businesses that rely on consistent gas supply.
              </p>
              <Link to="/business-learn-more" className="read-more">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services Section ===== */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>

        <div className="services-grid">
          <div className="service-item">
            <div className="service-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep within hours of ordering.</p>
          </div>

          <div className="service-item">
            <div className="service-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Subscription Plans</h3>
            <p>Customizable subscription plans that fit your usage patterns and budget.</p>
          </div>

          <div className="service-item">
            <div className="service-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h3>Equipment Maintenance</h3>
            <p>Professional maintenance and safety checks for your gas equipment.</p>
          </div>

          <div className="service-item">
            <div className="service-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Safety Training</h3>
            <p>Comprehensive safety training and guidelines for proper gas handling.</p>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <h2>Ready to Experience Hassle-Free Gas Supply?</h2>
        <p>
          Join thousands of satisfied customers who have made the switch to e-GAS for their gas supply needs. Register today and get your first delivery at a discounted rate!
        </p>
        <Link to="/register" className="cta-button">
          Get Started Now
        </Link>
      </section>

      {/* ===== Footer ===== */}
      <footer>
        <div className="footer-container">
          <div className="footer-logo">
            <h2>e-GAS</h2>
            <p>
              Providing reliable gas delivery services to homes and businesses across the region. Your comfort is our priority.
            </p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-links-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-section">
            <h3>Services</h3>
            <ul className="footer-links">
              <li>
                <Link to="/delivery">Gas Delivery</Link>
              </li>
              <li>
                <Link to="/subscription">Subscription Plans</Link>
              </li>
              <li>
                <Link to="/maintenance">Equipment Maintenance</Link>
              </li>
              <li>
                <Link to="/safety">Safety Checks</Link>
              </li>
              <li>
                <Link to="/business">Business Solutions</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-section">
            <h3>Contact Us</h3>
            <div className="footer-contact">
              <p>
                <i className="fas fa-map-marker-alt"></i> 123 Gas Street, Energy City
              </p>
              <p>
                <i className="fas fa-phone-alt"></i> +234 123 456 7890
              </p>
              <p>
                <i className="fas fa-envelope"></i> info@egas.com
              </p>
              <p>
                <i className="fas fa-clock"></i> Mon-Fri: 8AM - 6PM
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/support">Support</Link>
          </div>
          <p>&copy; 2025 e-GAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;