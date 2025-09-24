// components/Footer.js
import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <h2>e-GAS</h2>
          <p>
            Providing reliable gas delivery services to homes and businesses across the region. 
            Your comfort is our priority.
          </p>
          <div className="social-links">
            <a href="https://web.facebook.com/dworld2day"><i className="fab fa-facebook-f"></i></a>
            <a href="https://x.com/Musashehum"><i className="fab fa-twitter"></i></a>
            <a href="https://www.instagram.com/mozekhan?utm_source=qr&igsh=MTV0MDh1eWNxMG01cw=="><i className="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/musamohammedshehu"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-links-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div className="footer-links-section">
          <h3>Services</h3>
          <ul className="footer-links">
            <li><a href="delivery.html">Gas Delivery</a></li>
            <li><a href="subscription.html">Subscription Plans</a></li>
            <li><a href="maintenance.html">Equipment Maintenance</a></li>
            <li><a href="safety.html">Safety Checks</a></li>
            <li><a href="business.html">Business Solutions</a></li>
          </ul>
        </div>

        <div className="footer-links-section">
          <h3>Contact Us</h3>
          <div className="footer-contact">
            <p><i className="fas fa-map-marker-alt"></i> 123 Gas Street, Energy City</p>
            <p><i className="fas fa-phone-alt"></i> +234 123 456 7890</p>
            <p><i className="fas fa-envelope"></i> info@egas.com</p>
            <p><i className="fas fa-clock"></i> Mon-Fri: 8AM - 6PM</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms of Service</a>
          <a href="cookies.html">Cookie Policy</a>
          <a href="support.html">Support</a>
        </div>
        <p>&copy; 2025 e-GAS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;