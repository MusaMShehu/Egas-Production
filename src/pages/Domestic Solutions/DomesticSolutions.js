import React, { useState } from 'react';
import './DomesticSolutions.css'; // We'll create this CSS file

const DomesticSolutions = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  // Benefits data
  const benefits = [
    {
      icon: "fas fa-truck-fast",
      title: "Fast Delivery",
      description: "Get your gas delivered within hours of ordering, right to your doorstep."
    },
    {
      icon: "fas fa-calendar-check",
      title: "Subscription Plans",
      description: "Choose from flexible plans that match your consumption patterns."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Safety First",
      description: "All our cylinders undergo rigorous safety checks before delivery."
    },
    {
      icon: "fas fa-headset",
      title: "24/7 Support",
      description: "Our customer service team is always available to assist you."
    }
  ];

  // Plans data
  const plans = [
    {
      name: "Basic Plan",
      price: "₦8,500",
      period: "/month",
      description: "For small families (1-3 people)",
      features: [
        "12.5kg cylinder",
        "Monthly delivery",
        "Free safety inspection",
        "Priority scheduling",
        "Email reminders"
      ]
    },
    {
      name: "Family Plan",
      price: "₦12,500",
      period: "/month",
      description: "For medium families (4-6 people)",
      features: [
        "25kg cylinder",
        "Twice monthly delivery",
        "Free safety inspection",
        "Priority scheduling",
        "SMS & email reminders"
      ]
    },
    {
      name: "Large Family Plan",
      price: "₦18,000",
      period: "/month",
      description: "For large families (7+ people)",
      features: [
        "50kg cylinder",
        "Weekly delivery",
        "Free safety inspection",
        "Highest priority scheduling",
        "SMS, email & call reminders"
      ]
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How do I know which plan is right for my household?",
      answer: "Our basic plan is ideal for 1-3 people, family plan for 4-6 people, and large family plan for 7+ people. You can always start with one plan and adjust as needed based on your consumption."
    },
    {
      question: "What if I need gas outside my scheduled delivery?",
      answer: "You can request an emergency delivery through our app or website for an additional fee. We guarantee delivery within 4 hours for emergency requests."
    },
    {
      question: "Do you install the gas cylinder for me?",
      answer: "Yes, our trained technicians will install the cylinder and perform a safety check to ensure everything is working properly. This service is included with all our plans."
    },
    {
      question: "How do you ensure safety?",
      answer: "All our cylinders undergo rigorous testing and inspection. Our technicians are trained in safety protocols, and we provide safety guidelines to all our customers."
    }
  ];

  return (
    <div className="domestic-solutions-page">
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
        <h2>Domestic Gas Solutions</h2>
        <p>Reliable gas delivery solutions designed for households of all sizes. Never run out of gas when you need it most.</p>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a> > 
        <a href="/learn-more">Learn More</a> > 
        Domestic Solutions
      </div>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">Perfect for Your Home</h2>
        
        <div className="two-column">
          <div className="column-img">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Modern Kitchen" />
          </div>
          <div className="column-text">
            <h3>Tailored for Household Needs</h3>
            <p>Our domestic gas solutions are designed to meet the unique needs of every household. Whether you're cooking for one or for a large family, we have the perfect plan to ensure you never run out of gas.</p>
            <p>With our smart monitoring technology, we can predict when you'll need a refill and schedule deliveries automatically, so you can focus on what matters most - enjoying time with your family.</p>
          </div>
        </div>
        
        <h3 className="section-title">Benefits for Your Home</h3>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="benefit-icon">
                <i className={benefit.icon}></i>
              </div>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans-section">
        <h2 className="section-title">Domestic Plans</h2>
        
        <div className="plan-cards">
          {plans.map((plan, index) => (
            <div key={index} className="plan-card">
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">{plan.price}<span>{plan.period}</span></div>
                <p>{plan.description}</p>
              </div>
              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}><i className="fas fa-check"></i> {feature}</li>
                  ))}
                </ul>
                <a href="/register" className="plan-button">Choose Plan</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${activeFaq === index ? 'faq-active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question} <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready for Hassle-Free Gas Delivery?</h2>
        <p>Join thousands of households that trust e-GAS for their cooking needs. Sign up today and get your first month at 20% off!</p>
        <a href="/register" className="cta-button">Get Started Now</a>
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

export default DomesticSolutions;