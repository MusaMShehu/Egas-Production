import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MaintenanceServices.css'; // We'll extract the CSS separately

const MaintenanceServices = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="maintenance-page">
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
        <h2>Maintenance Services</h2>
        <p>Professional maintenance and safety checks to keep your gas equipment running safely and efficiently.</p>
      </section>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> > 
        <Link to="/quick-links">Quick Links</Link> > 
        Maintenance Services
      </div>

      {/* ===== Content Section ===== */}
      <section className="content-section">
        <h2 className="section-title">Keep Your Gas Equipment in Top Condition</h2>
        
        <div className="two-column">
          <div className="column-img">
            <img
              src="https://images.unsplash.com/photo-1585149553637-5a1d4a8a7c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Gas Maintenance"
            />
          </div>
          <div className="column-text">
            <h3>Professional Maintenance Services</h3>
            <p>
              Regular maintenance of your gas equipment is essential for safety, efficiency, and longevity. Our certified technicians provide comprehensive maintenance services for all types of gas appliances and systems.
            </p>
            <p>
              We follow strict safety protocols and use specialized equipment to ensure your gas systems are operating at peak performance while minimizing any risks associated with gas leaks or malfunctions.
            </p>
          </div>
        </div>
        
        <h3 className="section-title">Our Maintenance Services</h3>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-img">
              <img
                src="https://images.unsplash.com/photo-1603712610494-73e22f457c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Cylinder Inspection"
              />
            </div>
            <div className="service-content">
              <h3>Cylinder Inspection & Testing</h3>
              <p>Comprehensive inspection and testing of gas cylinders to ensure they meet safety standards.</p>
              <ul>
                <li><i className="fas fa-check"></i> Visual inspection for damage</li>
                <li><i className="fas fa-check"></i> Pressure testing</li>
                <li><i className="fas fa-check"></i> Valve functionality check</li>
                <li><i className="fas fa-check"></i> Leak detection</li>
              </ul>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-img">
              <img
                src="https://images.unsplash.com/photo-1600566753051-475254d7b3e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Appliance Service"
              />
            </div>
            <div className="service-content">
              <h3>Appliance Maintenance</h3>
              <p>Professional servicing of gas appliances to ensure efficient and safe operation.</p>
              <ul>
                <li><i className="fas fa-check"></i> Burner cleaning and adjustment</li>
                <li><i className="fas fa-check"></i> Gas pressure regulation</li>
                <li><i className="fas fa-check"></i> Ignition system check</li>
                <li><i className="fas fa-check"></i> Safety device testing</li>
              </ul>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-img">
              <img
                src="https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Pipe Installation"
              />
            </div>
            <div className="service-content">
              <h3>Pipeline Installation & Repair</h3>
              <p>Professional installation and repair of gas pipelines for safe gas distribution.</p>
              <ul>
                <li><i className="fas fa-check"></i> Pipeline installation</li>
                <li><i className="fas fa-check"></i> Leak detection and repair</li>
                <li><i className="fas fa-check"></i> Pressure testing</li>
                <li><i className="fas fa-check"></i> Corrosion protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Maintenance Plans ===== */}
      <section className="plans-section">
        <h2 className="section-title">Maintenance Plans</h2>
        
        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-header">
              <h3>Basic Maintenance</h3>
              <div className="plan-price">₦5,000<span>/visit</span></div>
              <p>For occasional maintenance needs</p>
            </div>
            <div className="plan-features">
              <ul>
                <li><i className="fas fa-check"></i> Visual inspection of cylinders</li>
                <li><i className="fas fa-check"></i> Basic leak detection</li>
                <li><i className="fas fa-check"></i> Appliance safety check</li>
                <li><i className="fas fa-check"></i> Basic cleaning</li>
                <li><i className="fas fa-times"></i> No priority scheduling</li>
              </ul>
              <a href="#" className="plan-button">Book Now</a>
            </div>
          </div>
          
          <div className="plan-card">
            <div className="plan-badge">Most Popular</div>
            <div className="plan-header">
              <h3>Standard Maintenance</h3>
              <div className="plan-price">₦12,000<span>/quarter</span></div>
              <p>For regular maintenance</p>
            </div>
            <div className="plan-features">
              <ul>
                <li><i className="fas fa-check"></i> Comprehensive inspection</li>
                <li><i className="fas fa-check"></i> Advanced leak detection</li>
                <li><i className="fas fa-check"></i> Appliance tuning</li>
                <li><i className="fas fa-check"></i> Detailed cleaning</li>
                <li><i className="fas fa-check"></i> Priority scheduling</li>
              </ul>
              <a href="#" className="plan-button">Subscribe Now</a>
            </div>
          </div>
          
          <div className="plan-card">
            <div className="plan-header">
              <h3>Premium Maintenance</h3>
              <div className="plan-price">₦40,000<span>/year</span></div>
              <p>For comprehensive care</p>
            </div>
            <div className="plan-features">
              <ul>
                <li><i className="fas fa-check"></i> All Standard features</li>
                <li><i className="fas fa-check"></i> Quarterly inspections</li>
                <li><i className="fas fa-check"></i> Emergency support</li>
                <li><i className="fas fa-check"></i> Parts discount (15%)</li>
                <li><i className="fas fa-check"></i> Highest priority scheduling</li>
              </ul>
              <a href="#" className="plan-button">Subscribe Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <h2>Ensure Your Gas Equipment is Safe & Efficient</h2>
        <p>
          Schedule a maintenance service with our certified technicians and enjoy peace of mind knowing your gas systems are in perfect condition.
        </p>
        <Link to="/contact" className="cta-button">
          Schedule Maintenance
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

export default MaintenanceServices;