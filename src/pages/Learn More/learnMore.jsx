import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTruck, 
  FaCalendarCheck, 
  FaTools, 
  FaShieldAlt,
  FaHome,
  FaUtensils,
  FaIndustry
} from 'react-icons/fa';
import './LearnMore.css'; 

const LearnMore = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="learn-more-page">
      
      {/* ===== Page Header ===== */}
      <section className="page-header">
        <h2>Unlock Boundless Opportunities with e-GAS</h2>
        <p>
          Discover how e-GAS provides customized gas solutions for homes, businesses, 
          and restaurants with our reliable delivery and innovative subscription plans.
        </p>
      </section>

      {/* ===== Opportunities Section ===== */}
      <section className="opportunities-section">
        <h2 className="section-title">Our Opportunities</h2>

        <div className="opportunity-cards">
          <div className="opportunity-card">
            <div className="card-img">
              <img src="https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Domestic Solutions"/>
            </div>
            <div className="card-content">
              <h3><FaHome className="card-icon" /> Domestic Solutions</h3>
              <p> Perfect for households of all sizes. Our domestic plans are 
                designed to ensure you never run out of gas when you need it most.</p>
              <Link to="/opportunities/domestic-opportunities" className="read-more">
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
              <h3><FaUtensils className="card-icon" /> Restaurant Solutions</h3>
              <p>
                Specialized high-volume gas delivery for restaurants and food service businesses. Never worry about interrupting your service.
              </p>
              <Link to="/opportunities/restaurant-opportunities" className="read-more">
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
              <h3><FaIndustry className="card-icon" /> Business Solutions</h3>
              <p>
                Comprehensive gas supply plans for industries, manufacturing units, and businesses that rely on consistent gas supply.
              </p>
              <Link to="/opportunities/business-opportunities" className="read-more">
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
              <FaTruck />
            </div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep within hours of ordering.</p>
          </div>

          <div className="service-item">
            <div className="service-icon">
              <FaCalendarCheck />
            </div>
            <h3>Subscription Plans</h3>
            <p>Customizable subscription plans that fit your usage patterns and budget.</p>
          </div>

          <div className="service-item">
            <div className="service-icon">
              <FaTools />
            </div>
            <h3>Equipment Maintenance</h3>
            <p>Professional maintenance and safety checks for your gas equipment.</p>
          </div>

          <div className="service-item">
            <div className="service-icon">
              <FaShieldAlt />
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
    </div>
  );
};

export default LearnMore;