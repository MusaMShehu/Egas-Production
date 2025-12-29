import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaLightbulb, FaUsers, FaCog, FaChartLine } from "react-icons/fa";

const Opportunities = () => {
  const opportunities = [
    {
      icon: <FaLightbulb />,
      title: "Smart Solutions",
      description: "Customizable gas delivery plans tailored to your specific needs"
    },
    {
      icon: <FaUsers />,
      title: "For Everyone",
      description: "Services for homes, businesses, restaurants, and organizations"
    },
    {
      icon: <FaCog />,
      title: "Flexible Plans",
      description: "Choose delivery frequency that matches your consumption pattern"
    },
    {
      icon: <FaChartLine />,
      title: "Cost Effective",
      description: "Save up to 20% with our subscription plans and bulk orders"
    }
  ];

  return (
    <section className="mobile-opportunities">
      <div className="opportunities-header">
        <h2>Unlock Boundless Opportunities</h2>
        <p className="section-subtitle">
          We provide countless opportunities for domestic users, businesses, and organizations.
        </p>
      </div>
      
      <div className="opportunities-grid">
        {opportunities.map((item, index) => (
          <div key={index} className="opportunity-card">
            <div className="opportunity-icon">
              {item.icon}
            </div>
            <h3 className="opportunity-title">{item.title}</h3>
            <p className="opportunity-description">{item.description}</p>
          </div>
        ))}
      </div>
      
      <div className="opportunities-content">
        <p>
          With our customizable services, you can set up your plan according to your need, budget, 
          and time of delivery. Also at e-gas we offer various services related to gas installation, 
          maintenance, and safety checks.
        </p>
        
        <Link className="learn-more-btn" to="/opportunities">
          <span>Learn More</span>
          <FaChevronRight />
        </Link>
      </div>
    </section>
  );
};

export default Opportunities;