import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PricingPlans.css'; // We'll extract the CSS separately

const PricingPlans = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [activeTab, setActiveTab] = useState('domestic-tab');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="pricing-page">
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
        <h2>Pricing Plans</h2>
        <p>Flexible and affordable pricing options designed to meet your household or business gas needs.</p>
      </section>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> > 
        <Link to="/quick-links">Quick Links</Link> > 
        Pricing Plans
      </div>

      {/* ===== Content Section ===== */}
      <section className="content-section">
        <h2 className="section-title">Choose Your Plan</h2>
        
        <div className="pricing-tabs">
          <button 
            className={`tab-button ${activeTab === 'domestic-tab' ? 'active' : ''}`} 
            onClick={() => setActiveTab('domestic-tab')}
          >
            Domestic Plans
          </button>
          <button 
            className={`tab-button ${activeTab === 'business-tab' ? 'active' : ''}`} 
            onClick={() => setActiveTab('business-tab')}
          >
            Business Plans
          </button>
          <button 
            className={`tab-button ${activeTab === 'subscription-tab' ? 'active' : ''}`} 
            onClick={() => setActiveTab('subscription-tab')}
          >
            Subscription Plans
          </button>
        </div>
        
        {/* Domestic Plans */}
        <div id="domestic-tab" className={`tab-content ${activeTab === 'domestic-tab' ? 'active' : ''}`}>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Basic Plan</h3>
                <div className="pricing-price">₦8,500<span>/month</span></div>
                <p>For small families (1-3 people)</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 12.5kg cylinder</li>
                  <li><i className="fas fa-check"></i> Monthly delivery</li>
                  <li><i className="fas fa-check"></i> Free safety inspection</li>
                  <li><i className="fas fa-check"></i> Priority scheduling</li>
                  <li><i className="fas fa-check"></i> Email reminders</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Family Plan</h3>
                <div className="pricing-price">₦12,500<span>/month</span></div>
                <p>For medium families (4-6 people)</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 25kg cylinder</li>
                  <li><i className="fas fa-check"></i> Twice monthly delivery</li>
                  <li><i className="fas fa-check"></i> Free safety inspection</li>
                  <li><i className="fas fa-check"></i> Priority scheduling</li>
                  <li><i className="fas fa-check"></i> SMS & email reminders</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Large Family Plan</h3>
                <div className="pricing-price">₦18,000<span>/month</span></div>
                <p>For large families (7+ people)</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 50kg cylinder</li>
                  <li><i className="fas fa-check"></i> Weekly delivery</li>
                  <li><i className="fas fa-check"></i> Free safety inspection</li>
                  <li><i className="fas fa-check"></i> Highest priority scheduling</li>
                  <li><i className="fas fa-check"></i> SMS, email & call reminders</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Plans */}
        <div id="business-tab" className={`tab-content ${activeTab === 'business-tab' ? 'active' : ''}`}>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter Business</h3>
                <div className="pricing-price">₦25,000<span>/month</span></div>
                <p>For small restaurants & shops</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 2x 50kg cylinders</li>
                  <li><i className="fas fa-check"></i> Weekly delivery</li>
                  <li><i className="fas fa-check"></i> Free safety inspection</li>
                  <li><i className="fas fa-check"></i> Business hours delivery</li>
                  <li><i className="fas fa-check"></i> Dedicated account manager</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-badge">Popular</div>
              <div className="pricing-header">
                <h3>Business Pro</h3>
                <div className="pricing-price">₦45,000<span>/month</span></div>
                <p>For medium restaurants</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 4x 50kg cylinders</li>
                  <li><i className="fas fa-check"></i> Twice weekly delivery</li>
                  <li><i className="fas fa-check"></i> Comprehensive safety checks</li>
                  <li><i className="fas fa-check"></i> 24/7 emergency support</li>
                  <li><i className="fas fa-check"></i> Dedicated account manager</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="pricing-price">₦80,000<span>/month</span></div>
                <p>For large restaurants & hotels</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 8x 50kg cylinders</li>
                  <li><i className="fas fa-check"></i> Daily delivery available</li>
                  <li><i className="fas fa-check"></i> Full maintenance included</li>
                  <li><i className="fas fa-check"></i> 24/7 priority support</li>
                  <li><i className="fas fa-check"></i> Dedicated team</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subscription Plans */}
        <div id="subscription-tab" className={`tab-content ${activeTab === 'subscription-tab' ? 'active' : ''}`}>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Pay-As-You-Go</h3>
                <div className="pricing-price">₦9,000<span>/cylinder</span></div>
                <p>For irregular users</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 12.5kg cylinder</li>
                  <li><i className="fas fa-check"></i> No subscription required</li>
                  <li><i className="fas fa-check"></i> Order when you need</li>
                  <li><i className="fas fa-check"></i> Standard delivery fees apply</li>
                  <li><i className="fas fa-check"></i> Basic safety check</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-badge">Best Value</div>
              <div className="pricing-header">
                <h3>Monthly Subscription</h3>
                <div className="pricing-price">₦11,000<span>/month</span></div>
                <p>For regular households</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 12.5kg cylinder monthly</li>
                  <li><i className="fas fa-check"></i> Free delivery</li>
                  <li><i className="fas fa-check"></i> Free safety inspection</li>
                  <li><i className="fas fa-check"></i> Priority scheduling</li>
                  <li><i className="fas fa-check"></i> 10% discount on extra cylinders</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Annual Subscription</h3>
                <div className="pricing-price">₦120,000<span>/year</span></div>
                <p>For committed savings</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> 12.5kg cylinder monthly</li>
                  <li><i className="fas fa-check"></i> Free delivery</li>
                  <li><i className="fas fa-check"></i> Comprehensive maintenance</li>
                  <li><i className="fas fa-check"></i> Highest priority scheduling</li>
                  <li><i className="fas fa-check"></i> 2 free emergency deliveries</li>
                </ul>
                <a href="#" className="pricing-button">Choose Plan</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comparison Table */}
        <div className="comparison-section">
          <h2 className="section-title">Plan Comparison</h2>
          
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Features</th>
                <th>Basic</th>
                <th>Family</th>
                <th>Large Family</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cylinder Size</td>
                <td>12.5kg</td>
                <td>25kg</td>
                <td>50kg</td>
              </tr>
              <tr>
                <td>Delivery Frequency</td>
                <td>Monthly</td>
                <td>Twice Monthly</td>
                <td>Weekly</td>
              </tr>
              <tr>
                <td>Safety Inspection</td>
                <td><i className="fas fa-check"></i></td>
                <td><i className="fas fa-check"></i></td>
                <td><i className="fas fa-check"></i></td>
              </tr>
              <tr>
                <td>Priority Scheduling</td>
                <td><i className="fas fa-check"></i></td>
                <td><i className="fas fa-check"></i></td>
                <td><i className="fas fa-check"></i></td>
              </tr>
              <tr>
                <td>Emergency Support</td>
                <td><i className="fas fa-times"></i></td>
                <td><i className="fas fa-check"></i></td>
                <td><i className="fas fa-check"></i></td>
              </tr>
              <tr>
                <td>SMS Reminders</td>
                <td><i className="fas fa-times"></i></td>
                <td><i className="fas fa-check"></i></td>
                <td><i className="fas fa-check"></i></td>
              </tr>
              <tr>
                <td>Phone Reminders</td>
                <td><i className="fas fa-times"></i></td>
                <td><i className="fas fa-times"></i></td>
                <td><i className="fas fa-check"></i></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className={`faq-item ${activeFaq === 0 ? 'faq-active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFaq(0)}>
              Can I switch between plans? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>Yes, you can switch between plans at any time. If you're upgrading, the new plan takes effect immediately. If you're downgrading, the change will take effect at the start of your next billing cycle.</p>
            </div>
          </div>
          
          <div className={`faq-item ${activeFaq === 1 ? 'faq-active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFaq(1)}>
              What payment methods do you accept? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>We accept various payment methods including bank transfers, credit/debit cards, and mobile money payments. All payments are processed securely through our encrypted payment gateway.</p>
            </div>
          </div>
          
          <div className={`faq-item ${activeFaq === 2 ? 'faq-active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFaq(2)}>
              Is there a cancellation fee? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>There are no cancellation fees for our monthly plans. For annual subscriptions, we offer a prorated refund based on the unused portion of your subscription, minus a small administrative fee.</p>
            </div>
          </div>
          
          <div className={`faq-item ${activeFaq === 3 ? 'faq-active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFaq(3)}>
              What happens if I need more gas than my plan provides? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>You can request additional cylinders at any time. Additional cylinders are charged at a discounted rate for subscribers, and delivery will be scheduled based on your priority level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <h2>Find the Perfect Plan for Your Needs</h2>
        <p>Join thousands of satisfied customers who trust e-GAS for their cooking needs. Sign up today and get your first month at 15% off!</p>
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

export default PricingPlans;