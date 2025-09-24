import React, { useState } from 'react';
import './FAQ.css'; // We'll create this CSS file

const FAQ = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFaqs, setActiveFaqs] = useState([]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleFaq = (index) => {
    if (activeFaqs.includes(index)) {
      setActiveFaqs(activeFaqs.filter(i => i !== index));
    } else {
      setActiveFaqs([...activeFaqs, index]);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // FAQ data organized by category
  const faqData = [
    {
      category: 'delivery',
      title: 'Delivery Questions',
      icon: 'fas fa-truck',
      questions: [
        {
          question: 'How long does delivery take?',
          answer: 'Our standard delivery time is within 4-6 hours of order confirmation. For emergency deliveries, we aim to reach you within 2 hours. Delivery times may vary based on your location and current demand.'
        },
        {
          question: 'What are your delivery hours?',
          answer: 'We deliver from 8:00 AM to 8:00 PM, Monday to Saturday. Sunday deliveries are available for emergency cases only. Outside these hours, emergency delivery is available at an additional fee.'
        },
        {
          question: 'Do you install the cylinder?',
          answer: 'Yes, our delivery personnel are trained to safely install the cylinder and perform a basic safety check. This service is included with all deliveries at no additional cost.'
        },
        {
          question: 'What areas do you serve?',
          answer: 'We currently serve major cities including Lagos, Abuja, Port Harcourt, Ibadan, and Benin City. We\'re expanding rapidly, so if your area isn\'t currently served, please contact us to find out when we\'ll be available in your location.'
        }
      ]
    },
    {
      category: 'safety',
      title: 'Safety Questions',
      icon: 'fas fa-shield-alt',
      questions: [
        {
          question: 'How do I detect a gas leak?',
          answer: 'Signs of a gas leak include: a sulfur-like or rotten egg smell, hissing or whistling sound near gas lines, visible damage to gas connections, dead or dying vegetation in unexpected places, and bubbles in standing water. If you suspect a leak, turn off the gas supply, extinguish all flames, avoid electrical switches, ventilate the area, and contact us immediately.'
        },
        {
          question: 'How often should I have safety checks?',
          answer: 'We recommend a professional safety check at least once a year. If you notice any issues with your gas appliances or smell gas, contact us immediately for an inspection. Our subscription plans include regular safety checks.'
        },
        {
          question: 'Where should I store my gas cylinder?',
          answer: 'Gas cylinders should be stored outdoors in a well-ventilated area, away from heat sources, direct sunlight, and flammable materials. They should be kept upright and secured to prevent tipping. Never store cylinders in basements or enclosed spaces.'
        }
      ]
    },
    {
      category: 'billing',
      title: 'Billing & Payment Questions',
      icon: 'fas fa-credit-card',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept various payment methods including cash on delivery, bank transfer, credit/debit cards, and mobile money payments. Online payments are processed through a secure payment gateway.'
        },
        {
          question: 'Can I change my subscription plan?',
          answer: 'Yes, you can upgrade your plan at any time, with the new rate applying immediately. Downgrades take effect at the start of your next billing cycle. There are no fees for changing plans.'
        },
        {
          question: 'Is there a delivery fee?',
          answer: 'Standard delivery is free for all subscription plans. For one-time orders, a delivery fee of ₦500-₦1,500 applies depending on your location. Emergency deliveries outside regular hours incur an additional fee.'
        }
      ]
    },
    {
      category: 'account',
      title: 'Account & Service Questions',
      icon: 'fas fa-user-circle',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account on our website by clicking the "Sign Up" button. You\'ll need to provide your name, email address, phone number, and address. Once registered, you can place orders, manage your subscription, and track deliveries.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a link to reset your password. If you\'re having trouble, contact our customer support team for assistance.'
        },
        {
          question: 'Can I pause my subscription?',
          answer: 'Yes, you can pause your subscription for up to 3 months if you\'re traveling or won\'t need gas for an extended period. Simply contact our customer service team at least 3 days before your next scheduled delivery to arrange a pause.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription at any time through your account dashboard or by contacting customer service. For monthly plans, cancellation takes effect immediately. For annual plans, you\'ll receive a prorated refund for unused months.'
        }
      ]
    }
  ];

  // Filter FAQs based on active category and search term
  const filteredFaqs = faqData.filter(category => 
    activeCategory === 'all' || category.category === activeCategory
  ).map(category => {
    const filteredQuestions = category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm) || 
      q.answer.toLowerCase().includes(searchTerm)
    );
    
    return {
      ...category,
      questions: filteredQuestions
    };
  }).filter(category => category.questions.length > 0);

  return (
    <div className="faq-page">
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
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our services, delivery, safety, and more.</p>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a> > 
        <a href="/quick-links">Quick Links</a> > 
        FAQ
      </div>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">How Can We Help You?</h2>
        
        <div className="search-section">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for questions..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="category-tabs">
          <button 
            className={`category-button ${activeCategory === 'all' ? 'active' : ''}`} 
            onClick={() => handleCategoryChange('all')}
          >
            All Questions
          </button>
          <button 
            className={`category-button ${activeCategory === 'delivery' ? 'active' : ''}`} 
            onClick={() => handleCategoryChange('delivery')}
          >
            Delivery
          </button>
          <button 
            className={`category-button ${activeCategory === 'safety' ? 'active' : ''}`} 
            onClick={() => handleCategoryChange('safety')}
          >
            Safety
          </button>
          <button 
            className={`category-button ${activeCategory === 'billing' ? 'active' : ''}`} 
            onClick={() => handleCategoryChange('billing')}
          >
            Billing & Payments
          </button>
          <button 
            className={`category-button ${activeCategory === 'account' ? 'active' : ''}`} 
            onClick={() => handleCategoryChange('account')}
          >
            Account & Services
          </button>
        </div>
        
        <div className="faq-container">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category" data-category={category.category}>
              <h3><i className={category.icon}></i> {category.title}</h3>
              
              {category.questions.map((faq, faqIndex) => {
                const globalIndex = categoryIndex * 100 + faqIndex; // Create unique index
                return (
                  <div key={faqIndex} className={`faq-item ${activeFaqs.includes(globalIndex) ? 'faq-active' : ''}`}>
                    <div className="faq-question" onClick={() => toggleFaq(globalIndex)}>
                      {faq.question} <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="contact-prompt">
          <h3>Still Have Questions?</h3>
          <p>Can't find the answer you're looking for? Our customer support team is available to help you with any questions or concerns.</p>
          <a href="/contact" className="contact-button">Contact Support</a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Get Started with e-GAS?</h2>
        <p>Join thousands of satisfied customers who enjoy reliable gas delivery and exceptional service.</p>
        <a href="/register" className="cta-button">Sign Up Now</a>
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

export default FAQ;