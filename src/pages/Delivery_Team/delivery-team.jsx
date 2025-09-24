import React, { useState } from 'react';
import './DeliveryTeam.css'; // We'll create this CSS file

const DeliveryTeam = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Team member data
  const teamMembers = [
    {
      id: 1,
      name: "Chinedu Okoro",
      role: "Lead Delivery Coordinator",
      description: "With over 8 years of experience, Chinedu ensures all deliveries are efficiently routed and completed on time.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      id: 2,
      name: "Amina Yusuf",
      role: "Safety Officer",
      description: "Amina ensures all safety protocols are followed during delivery and handling of gas cylinders.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
    },
    {
      id: 3,
      name: "Emeka Nwankwo",
      role: "Senior Delivery Driver",
      description: "Emeka has been with e-GAS for 5 years and knows the city routes like the back of his hand.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      id: 4,
      name: "Funke Adebayo",
      role: "Customer Relations Specialist",
      description: "Funke ensures customers are satisfied with their delivery experience and handles any special requests.",
      image: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  ];

  // Stats data
  const stats = [
    { number: "98%", label: "On-Time Delivery Rate" },
    { number: "5,000+", label: "Happy Customers" },
    { number: "24/7", label: "Delivery Support" },
    { number: "15", label: "Professional Team Members" }
  ];

  return (
    <div className="delivery-team-page">
      {/* Header with Navbar */}
      <header>
        <div className="navbar">
          <div className="hamburger" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <h1>e-GAS</h1>
          <div className="auth-buttons">
            <button className="signin-btn" onClick={() => window.location.href = '/login'}>Sign In</button>
            <button className="signup-btn" onClick={() => window.location.href = '/register'}>Sign Up</button>
          </div>
          <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <h2>Our Delivery Team</h2>
        <p>Meet the dedicated professionals who ensure your gas is delivered safely and on time, every time.</p>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a> 
        <a href="/quick-links">Quick Links</a>  
        Our Delivery Team
      </div>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">The Faces Behind Your Delivery</h2>
        
        <div className="two-column">
          <div className="column-img">
            <img src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1482&q=80" alt="Delivery Team" />
          </div>
          <div className="column-text">
            <h3>Professional & Reliable Service</h3>
            <p>Our delivery team consists of trained professionals who understand the importance of timely and safe gas delivery. Each member undergoes rigorous training in safety protocols, customer service, and efficient logistics.</p>
            <p>We pride ourselves on our punctuality and professionalism. Our team is equipped with GPS-tracked vehicles and follows optimized routes to ensure your gas arrives when you need it.</p>
          </div>
        </div>
        
        <h3 className="section-title">Meet Our Delivery Experts</h3>
        
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-member">
              <div className="member-img">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p>{member.description}</p>
                <div className="member-social">
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2 className="section-title">Our Delivery Excellence</h2>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Experience Our Professional Delivery Service</h2>
        <p>Join thousands of satisfied customers who trust e-GAS for timely and safe gas delivery.</p>
        <a href="/register" className="cta-button">Place Your Order Now</a>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-logo">
            <h2>e-GAS</h2>
            <p>Providing reliable gas delivery services to homes and businesses across the region. Your comfort is our priority.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-links-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links-section">
            <h3>Services</h3>
            <ul className="footer-links">
              <li><a href="/delivery">Gas Delivery</a></li>
              <li><a href="/subscription">Subscription Plans</a></li>
              <li><a href="/maintenance">Equipment Maintenance</a></li>
              <li><a href="/safety">Safety Checks</a></li>
              <li><a href="/business">Business Solutions</a></li>
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
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/support">Support</a>
          </div>
          <p>&copy; 2025 e-GAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DeliveryTeam;