import React, { useState } from 'react';
import './DomesticSolutions.css';
import { Link } from 'react-router-dom';
import SubscriptionPlans from '../../components/pages/SubscriptionPlans';
import { 
  FaTruckFast, 
  FaCalendarCheck, 
  FaShieldHalved, 
  FaHeadset, 
  FaChevronDown,
  FaCheck
} from 'react-icons/fa6';

const DomesticSolutions = () => {
  const [activeFaq, setActiveFaq] = useState(null);

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
      icon: FaTruckFast,
      title: "Fast Delivery",
      description: "Get your gas delivered within hours of ordering, right to your doorstep."
    },
    {
      icon: FaCalendarCheck,
      title: "Subscription Plans",
      description: "Choose from flexible plans that match your consumption patterns."
    },
    {
      icon: FaShieldHalved,
      title: "Safety First",
      description: "All our cylinders undergo rigorous safety checks before delivery."
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Our customer service team is always available to assist you."
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
    <div className="dom-sol-domestic-solutions-page">
      
      {/* Page Header */}
      <section className="dom-sol-page-header">
        <h2>Domestic Gas Solutions</h2>
        <p>Reliable gas delivery solutions designed for households of all sizes. Never run out of gas when you need it most.</p>
      </section>

      {/* Breadcrumb */}
      <div className="dom-sol-breadcrumb">
        <Link to="/">Home</Link>
        <Link to="/opportunities">Learn More</Link>
        Domestic Solutions
      </div>

      {/* Content Section */}
      <section className="dom-sol-content-section">
        <h2 className="dom-sol-section-title">Perfect for Your Home</h2>
        
        <div className="dom-sol-two-column">
          <div className="dom-sol-column-img">
            <img src="https://media.istockphoto.com/id/1538320890/photo/a-happy-multiracial-couple-is-cooking-an-organic-vegan-lunch-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=iz0RPrhj2ROrL-pdkxaS77KgulErkGsoC79qieA7Lx0=" alt="Modern Kitchen" />
          </div>
          <div className="dom-sol-column-text">
            <h3>Tailored for Household Needs</h3>
            <p>Our domestic gas solutions are designed to meet the unique needs of every household. Whether you're cooking for one or for a large family, we have the perfect plan to ensure you never run out of gas.</p>
            <p>With our smart monitoring technology, we can predict when you'll need a refill and schedule deliveries automatically, so you can focus on what matters most - enjoying time with your family.</p>
          </div>
        </div>
        
        <h3 className="dom-sol-section-title">Benefits for Your Home</h3>
        
        <div className="dom-sol-benefits-grid">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="dom-sol-benefit-item">
                <div className="dom-sol-benefit-icon">
                  <IconComponent />
                </div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SubscriptionPlans />

      {/* FAQ Section */}
      <section className="dom-sol-faq-section">
        <h2 className="dom-sol-section-title">Frequently Asked Questions</h2>
        
        {faqs.map((faq, index) => (
          <div key={index} className={`dom-sol-faq-item ${activeFaq === index ? 'dom-sol-faq-active' : ''}`}>
            <div className="dom-sol-faq-question" onClick={() => toggleFaq(index)}>
              {faq.question} <FaChevronDown />
            </div>
            <div className="dom-sol-faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="dom-sol-cta-section">
        <h2>Ready for Hassle-Free Gas Delivery?</h2>
        <p>Join thousands of households that trust e-GAS for their cooking needs. Sign up today and get your first month at 20% off!</p>
        <a href="/register" className="dom-sol-cta-button">Get Started Now</a>
      </section>
    </div>
  );
};

export default DomesticSolutions;