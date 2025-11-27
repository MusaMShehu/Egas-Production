// components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Social */}
        <div className="footer-logo">
          <h2>e-GAS</h2>
          <p>
            Providing reliable gas delivery services to homes and businesses
            across the region. Your comfort is our priority.
          </p>
          <div className="social-links">
            <a
              href="https://web.facebook.com/dworld2day"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/Musashehum"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/mozekhan?utm_source=qr&igsh=MTV0MDh1eWNxMG01cw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/musamohammedshehu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Services */}
        <div className="footer-links-section">
          <h3>Services</h3>
          <ul className="footer-links">
            <li>
              <Link to="/delivery-team">Gas Delivery</Link>
            </li>
            <li>
              <Link to="/pricing-plans">Subscription Plans</Link>
            </li>
            <li>
              <Link to="/maintenance-services">Equipment Maintenance</Link>
            </li>
            <li>
              <Link to="/safety-guidelines">Safety Checks</Link>
            </li>
            <li>
              <Link to="/business">Business Solutions</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-links-section">
          <h3>Contact Us</h3>
          <div className="footer-contact">
            <p>
              <FaMapMarkerAlt /> 123 Gas Street, Maiduguri
            </p>
            <p>
              <FaPhoneAlt /> +2348036109468
            </p>
            <p>
              <FaEnvelope /> info@egas.com
            </p>
            <p>
              <FaClock /> Mon-Fri: 8AM - 6PM
            </p>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <Link to="/privacy_policy">Privacy Policy</Link>
          <Link to="/terms_of_service">Terms of Service</Link>
          <Link to="/cookies">Cookie Policy</Link>
          <Link to="/support">Support</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} e-GAS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
