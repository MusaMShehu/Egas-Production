// src/components/Business/Business.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTruck, 
  FaChartLine, 
  FaShieldAlt, 
  FaHeadset,
  FaUtensils,
  FaHotel,
  FaIndustry,
  FaSchool,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import './Business.css';

const Business = () => {
  const [activeSolution, setActiveSolution] = useState(null);

  const toggleSolution = (index) => {
    setActiveSolution(activeSolution === index ? null : index);
  };

  const benefits = [
    {
      icon: FaTruck,
      title: "Reliable Supply",
      description: "Never run out of gas with our guaranteed delivery schedules and emergency refill services."
    },
    {
      icon: FaChartLine,
      title: "Cost Efficiency",
      description: "Save up to 30% on your gas expenses with our bulk pricing and optimized delivery routes."
    },
    {
      icon: FaShieldAlt,
      title: "Safety Compliance",
      description: "Full compliance with all safety regulations and regular equipment inspections included."
    },
    {
      icon: FaHeadset,
      title: "Dedicated Support",
      description: "24/7 customer support with a dedicated account manager for your business."
    }
  ];

  const industries = [
    {
      icon: FaUtensils,
      title: "Restaurants & Cafes",
      description: "Continuous supply for high-volume cooking needs with flexible delivery schedules."
    },
    {
      icon: FaHotel,
      title: "Hotels & Hospitality",
      description: "Comprehensive gas solutions for kitchens, heating, and backup power systems."
    },
    {
      icon: FaIndustry,
      title: "Manufacturing",
      description: "Industrial-grade gas supply for manufacturing processes and facility operations."
    },
    {
      icon: FaSchool,
      title: "Institutions",
      description: "Reliable gas supply for schools, hospitals, and government facilities."
    }
  ];

  const solutions = [
    {
      title: "Customized Delivery Plans",
      content: "We create tailored delivery schedules based on your consumption patterns, ensuring you never run out of gas. Our advanced monitoring system tracks your usage and automatically schedules deliveries before you run low."
    },
    {
      title: "Bulk Pricing Options",
      content: "Significant cost savings for high-volume users with our tiered pricing structure. The more you use, the less you pay per unit, making our service exceptionally cost-effective for businesses."
    },
    {
      title: "Equipment Installation & Maintenance",
      content: "Professional installation of industrial-grade gas systems with regular maintenance included. Our certified technicians ensure your equipment operates at peak efficiency and safety standards."
    },
    {
      title: "Emergency Support Services",
      content: "24/7 emergency response team ready to address any gas-related issues immediately. We guarantee a response within 2 hours for critical situations in urban areas."
    },
    {
      title: "Usage Analytics & Reporting",
      content: "Detailed consumption reports and analytics to help you optimize your gas usage and reduce costs. Our online portal provides real-time insights into your consumption patterns."
    }
  ];

  return (
    <div className="business-page">

      {/* Page Header */}
      <section className="page-header">
        <h2>Business Solutions</h2>
        <p>Tailored gas supply solutions for hotels, commercial enterprises and corporate organization</p>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <Link to="/opportunities">Learn More</Link>
        Business Solutions
      </div>

      {/* Content Section */}
      <section className="content-section">
        <div className="two-column">
          <div className="column-img">
            <img 
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80" 
              alt="Business Solutions" 
            />
          </div>
          <div className="column-text">
            <h3>Customized Gas Solutions for Your Business</h3>
            <p>At e-GAS, we understand that businesses have unique gas requirements that differ from residential needs. Our commercial solutions are designed to ensure uninterrupted supply, cost efficiency, and complete safety compliance for your operations.</p>
            <p>Whether you run a restaurant, hotel, manufacturing facility, or any other business and corporate organization that relies on gas, we have the expertise and infrastructure to meet your specific needs with reliable, scalable solutions.</p>
          </div>
        </div>

        {/* Benefits Section */}
        <h2 className="section-title">Why Choose e-GAS for Your Business?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="benefit-item">
                <div className="benefit-icon">
                  <IconComponent />
                </div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Industries Section */}
        <section className="industries-section">
          <h2 className="section-title">Industries We Serve</h2>
          <div className="industries-grid">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <div key={index} className="industry-card">
                  <div className="industry-icon">
                    <IconComponent />
                  </div>
                  <h3>{industry.title}</h3>
                  <p>{industry.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Solutions Section */}
        <section className="solutions-section">
          <h2 className="section-title">Our Business Solutions</h2>
          <div className="solutions-accordion">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className={`solution-item ${activeSolution === index ? 'solution-active' : ''}`}
              >
                <div 
                  className="solution-header"
                  onClick={() => toggleSolution(index)}
                >
                  {solution.title}
                  {activeSolution === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <div className="solution-content">
                  <p>{solution.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Optimize Your Business Gas Supply?</h2>
          <p>Join hundreds of businesses that trust e-GAS for their commercial gas needs. Our experts will create a customized solution that fits your specific requirements and budget.</p>
          <a href="/contact" className="cta-button">Get a Business Quote</a>
        </section>
      </section>
    </div>
  );
};

export default Business;