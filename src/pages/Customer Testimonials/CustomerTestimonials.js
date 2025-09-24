import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerTestimonials.css'; // We'll extract the CSS separately

const CustomerTestimonials = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="testimonials-page">
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
        <h2>Customer Testimonials</h2>
        <p>Hear what our satisfied customers have to say about their experience with e-GAS services.</p>
      </section>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <Link to="/quick-links">Quick Links</Link>
        Customer Testimonials
      </div>

      {/* ===== Content Section ===== */}
      <section className="content-section">
        <h2 className="section-title">What Our Customers Say</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"e-GAS has transformed how we manage our kitchen. The subscription service means we never run out of gas, and their delivery team is always punctual and professional."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Chinwe Okonkwo" />
              </div>
              <div className="author-details">
                <h4>Chinwe Okonkwo</h4>
                <p>Lagos</p>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"As a restaurant owner, reliable gas supply is critical to my business. e-GAS has never let me down, even during our busiest periods. Their emergency service is a lifesaver!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Tunde Adebayo" />
              </div>
              <div className="author-details">
                <h4>Tunde Adebayo</h4>
                <p>Restaurant Owner, Abuja</p>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"The safety inspection service gave me peace of mind. The technician was thorough and explained everything clearly. I'll definitely be using their maintenance plan."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Amina Yusuf" />
              </div>
              <div className="author-details">
                <h4>Amina Yusuf</h4>
                <p>Port Harcourt</p>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"I've been using e-GAS for over a year now, and I'm impressed with their consistency. The app makes ordering so easy, and their customer service team is always helpful."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Emeka Nwankwo" />
              </div>
              <div className="author-details">
                <h4>Emeka Nwankwo</h4>
                <p>Enugu</p>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"The subscription plan has saved me both time and money. No more last-minute rushes to find gas, and the regular delivery means I always have supply when I need it."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/28.jpg" alt="Funke Adeleke" />
              </div>
              <div className="author-details">
                <h4>Funke Adeleke</h4>
                <p>Ibadan</p>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              <p>"As a busy professional, e-GAS has been a game-changer. I no longer worry about running out of gas or dealing with unreliable suppliers. Highly recommended!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Oluwaseun Adeyemi" />
              </div>
              <div className="author-details">
                <h4>Oluwaseun Adeyemi</h4>
                <p>Banker, Lagos</p>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Video Testimonials ===== */}
      <section className="video-section">
        <h2 className="section-title">Video Testimonials</h2>
        
        <div className="video-grid">
          <div className="video-card">
            <div className="video-container">
              <iframe src="https://www.youtube.com/embed/jNQXAC9IVRw" title="Customer Testimonial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div className="video-info">
              <h3>Mrs. Johnson's Experience</h3>
              <p>"e-GAS made my family's cooking so much easier!"</p>
            </div>
          </div>
          
          <div className="video-card">
            <div className="video-container">
              <iframe src="https://www.youtube.com/embed/W8A3MHuEcU0" title="Restaurant Owner Testimonial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div className="video-info">
              <h3>Chef Ade's Story</h3>
              <p>How e-GAS supports his restaurant business</p>
            </div>
          </div>
          
          <div className="video-card">
            <div className="video-container">
              <iframe src="https://www.youtube.com/embed/7U1yITy3gP0" title="Safety Inspection Testimonial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div className="video-info">
              <h3>Safety First</h3>
              <p>Mr. Bello shares his maintenance experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="stats-section">
        <h2 className="section-title">Our Happy Customers</h2>
        
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Satisfied Customers</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Customer Retention Rate</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Average Rating</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Customer Support</div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <h2>Join Our Community of Satisfied Customers</h2>
        <p>Experience the e-GAS difference for yourself. Sign up today and enjoy reliable gas delivery with premium customer service.</p>
        <Link to="/register" className="cta-button">Get Started Now</Link>
      </section>

      {/* ===== Footer ===== */}
      <footer>
        <div className="footer-container">
          <div className="footer-logo">
            <h2>e-GAS</h2>
            <p>Providing reliable gas delivery services to homes and businesses across the region. Your comfort is our priority.</p>
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

export default CustomerTestimonials;