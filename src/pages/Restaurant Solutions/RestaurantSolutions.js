import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RestaurantSolutions.css'; // We'll extract the CSS separately

const RestaurantSolutions = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="restaurant-page">
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
        <h2>Restaurant Gas Solutions</h2>
        <p>Specialized high-volume gas delivery for restaurants and food service businesses. Never worry about interrupting your service.</p>
      </section>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> > 
        <Link to="/learn-more">Learn More</Link> > 
        Restaurant Solutions
      </div>

      {/* ===== Content Section ===== */}
      <section className="content-section">
        <h2 className="section-title">Designed for Food Service Businesses</h2>
        
        <div className="two-column">
          <div className="column-img">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Restaurant Kitchen"
            />
          </div>
          <div className="column-text">
            <h3>Keep Your Kitchen Running</h3>
            <p>
              For restaurants, consistent gas supply isn't just a convenience—it's essential for business operations. Our restaurant solutions are designed to ensure you never run out of gas during peak hours.
            </p>
            <p>
              We understand the unique demands of food service businesses, which is why we offer specialized high-volume cylinders, flexible delivery schedules, and emergency support to keep your kitchen running smoothly.
            </p>
          </div>
        </div>
        
        <h3 className="section-title">Benefits for Restaurants</h3>
        
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-fire"></i>
            </div>
            <h4>High-Volume Cylinders</h4>
            <p>Specialized cylinders designed for commercial kitchen usage.</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h4>Flexible Scheduling</h4>
            <p>Delivery times tailored to your business hours.</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <h4>Emergency Support</h4>
            <p>24/7 emergency delivery for unexpected shortages.</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h4>Usage Analytics</h4>
            <p>Detailed reports to help optimize your consumption.</p>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="features-section">
        <h2 className="section-title">Our Restaurant Services</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-img">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80"
                alt="Commercial Cylinders"
              />
            </div>
            <div className="feature-content">
              <h3>Commercial Cylinders</h3>
              <p>High-capacity cylinders designed specifically for commercial kitchens with heavy usage demands.</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-img">
              <img
                src="https://images.unsplash.com/photo-1578474846613-eb6daf164c52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Scheduled Delivery"
              />
            </div>
            <div className="feature-content">
              <h3>Scheduled Delivery</h3>
              <p>Regular deliveries scheduled during off-peak hours to minimize disruption to your operations.</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-img">
              <img
                src="https://images.unsplash.com/photo-1585149553637-5a1d4a8a7c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Equipment Maintenance"
              />
            </div>
            <div className="feature-content">
              <h3>Equipment Maintenance</h3>
              <p>Regular maintenance and safety checks for all your gas equipment by certified technicians.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials Section ===== */}
      <section className="testimonials-section">
        <h2 className="section-title">What Restaurant Owners Say</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"Since switching to e-GAS, we've never had to worry about running out of gas during dinner service. Their emergency delivery has saved us multiple times."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Chef Michael" />
              </div>
              <div className="author-details">
                <h4>Michael Adeyemi</h4>
                <p>Head Chef, Spice Garden</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"The usage analytics helped us optimize our gas consumption, saving us over 20% on our monthly gas expenses. Highly recommended for any restaurant."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Manager Sarah" />
              </div>
              <div className="author-details">
                <h4>Sarah Johnson</h4>
                <p>Manager, City Bistro</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"As a chain of restaurants, we needed a reliable gas supplier that could service all our locations consistently. e-GAS has delivered perfectly."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Owner David" />
              </div>
              <div className="author-details">
                <h4>David Okon</h4>
                <p>Owner, Taste of Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <h2>Power Your Restaurant with Reliable Gas Supply</h2>
        <p>
          Join hundreds of restaurants that trust e-GAS for their cooking needs. Sign up today and get your first month with free delivery!
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

export default RestaurantSolutions;