// src/components/Services/Services.js
import React from 'react';
import { Link } from "react-router-dom";
import { 
  FaTruck, 
  FaCalendarAlt, 
  FaTools, 
  FaShieldAlt, 
  FaBuilding, 
  FaFire, 
  FaArrowRight, 
  FaQuoteLeft 
} from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: FaTruck,
      title: "Doorstep Delivery",
      description: "Get your LPG gas delivered to your home or business at your convenience. Schedule one-time or recurring deliveries.",
      link: "delivery.html"
    },
    {
      id: 2,
      icon: FaCalendarAlt,
      title: "Subscription Plans",
      description: "Never run out of gas with our automatic refill plans. Choose the subscription plan that matches your usage pattern.",
      link: "subscription.html"
    },
    {
      id: 3,
      icon: FaTools,
      title: "Equipment Maintenance",
      description: "Professional inspection and maintenance of your gas equipment to ensure safety and optimal performance.",
      link: "maintenance.html"
    },
    {
      id: 4,
      icon: FaShieldAlt,
      title: "Safety Checks",
      description: "Our certified technicians will inspect your gas installation and identify potential safety hazards.",
      link: "safety.html"
    },
    {
      id: 5,
      icon: FaBuilding,
      title: "Business Solutions",
      description: "Customized gas supply plans for restaurants, hotels, and other commercial establishments.",
      link: "/business"
    },
    {
      id: 6,
      icon: FaFire,
      title: "Emergency Refills",
      description: "Unexpectedly ran out of gas? We offer priority emergency refill services for urgent situations.",
      link: "emergency.html"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Place Your Order",
      description: "Order online or through our mobile app. Choose between one-time delivery or subscription plan."
    },
    {
      number: 2,
      title: "Schedule Delivery",
      description: "Select your preferred delivery date and time window that works best for you."
    },
    {
      number: 3,
      title: "Professional Delivery",
      description: "Our certified delivery team arrives at your doorstep with your gas cylinder."
    },
    {
      number: 4,
      title: "Safe Installation",
      description: "We can connect your new cylinder and perform a safety check (optional service)."
    }
  ];

  return (
    <div className="services-page">
      
      {/* Services Hero Section */}
      <section className="service-page-hero">
        <h2>Our Services</h2>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="section-header">
          <h3>Services We Render</h3>
          <p>Beyond just gas delivery, we provide complete solutions for all your gas needs</p>
        </div>
        
        <div className="services-grid">
          {services.map(service => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <IconComponent />
                </div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <a href={service.link}>
                  Learn More <FaArrowRight />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h3>How Our Service Works</h3>
          <p>Getting your gas has never been easier</p>
        </div>
        
        <div className="steps-container">
          {steps.map(step => (
            <div key={step.number} className="step">
              <div className="step-number">{step.number}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
      <section className="pro-list-products-cta">
        <div className="pro-list-container">
          <div className="pro-list-cta-content">
            <h2>Ready to Place Your Order?</h2>
            <p>
              Contact us today to get the best gas products and accessories for
              your needs
            </p>
            <div className="pro-list-cta-buttons">
              <Link to="/contact" className="pro-list-btn-secondary">
                Contact Us
              </Link>
              <Link to="/order" className="pro-list-btn-primary">
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </section>
      </section>

      {/* Testimonials
      <section className="testimonials-section">
        <div className="section-header">
          <h3>What Our Customers Say</h3>
          <p>Don't just take our word for it</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <FaQuoteLeft />
                <p>{testimonial.quote}</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h5>{testimonial.name}</h5>
                  <p>{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

    </div>
  );
};

export default Services;