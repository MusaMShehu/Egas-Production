// src/components/Services/Services.js
import React from 'react';
// import Header from '../Header';
// import Footer from '../Footer';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: "fas fa-truck",
      title: "Doorstep Delivery",
      description: "Get your gas cylinders delivered to your home or business at your convenience. Schedule one-time or recurring deliveries.",
      link: "delivery.html"
    },
    {
      id: 2,
      icon: "fas fa-calendar-alt",
      title: "Subscription Plans",
      description: "Never run out of gas with our automatic refill plans. Choose the frequency that matches your usage pattern.",
      link: "subscription.html"
    },
    {
      id: 3,
      icon: "fas fa-tools",
      title: "Equipment Maintenance",
      description: "Professional inspection and maintenance of your gas equipment to ensure safety and optimal performance.",
      link: "maintenance.html"
    },
    {
      id: 4,
      icon: "fas fa-shield-alt",
      title: "Safety Checks",
      description: "Our certified technicians will inspect your gas installation and identify potential safety hazards.",
      link: "safety.html"
    },
    {
      id: 5,
      icon: "fas fa-building",
      title: "Business Solutions",
      description: "Customized gas supply plans for restaurants, hotels, and other commercial establishments.",
      link: "/business"
    },
    {
      id: 6,
      icon: "fas fa-burn",
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

  const testimonials = [
    {
      id: 1,
      quote: "e-GAS has completely changed how we manage our kitchen. The subscription service means we never run out of gas, and the delivery team is always punctual.",
      name: "Amina Yusuf",
      location: "Lagos",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      quote: "As a restaurant owner, reliable gas supply is critical. e-GAS's business solution has taken the stress out of managing our gas needs.",
      name: "Emeka Okafor",
      location: "Abuja",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      quote: "The safety check service gave me peace of mind about my home gas installation. The technician was knowledgeable and professional.",
      name: "Chioma Adeleke",
      location: "Port Harcourt",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className="services-page">
      {/* <Header /> */}
      
      {/* Services Hero Section */}
      <section className="page-hero">
        <h2>Our Services</h2>
        <p>Comprehensive gas solutions for homes and businesses</p>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="section-header">
          <h3>What We Offer</h3>
          <p>Beyond just gas delivery, we provide complete solutions for all your gas needs</p>
        </div>
        
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h4>{service.title}</h4>
              <p>{service.description}</p>
              <a href={service.link}>
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          ))}
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
        
        <div className="cta-button">
          <button onClick={() => window.location.href = '/signup'}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h3>What Our Customers Say</h3>
          <p>Don't just take our word for it</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <i className="fas fa-quote-left"></i>
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
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Services;