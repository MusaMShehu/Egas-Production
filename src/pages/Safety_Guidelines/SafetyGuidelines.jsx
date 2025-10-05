import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SafetyGuidelines.css'; // We'll extract the CSS separately

const SafetyGuidelines = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // const toggleMenu = () => {
  //   setMenuActive(!menuActive);
  // };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="safety-page">
      
      {/* ===== Page Header ===== */}
      <section className="page-header">
        <h2>Safety Guidelines</h2>
        <p>Essential safety information for the proper handling, storage, and use of gas cylinders and appliances.</p>
      </section>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <Link to="/quick-links">Quick Links</Link>
        Safety Guidelines
      </div>

      {/* ===== Content Section ===== */}
      <section className="content-section">
        <h2 className="section-title">Gas Safety Guidelines</h2>
        
        <div className="safety-grid">
          <div className="safety-card">
            <div className="safety-img">
              <img
                src="https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Cylinder Storage"
              />
            </div>
            <div className="safety-content">
              <h3><i className="fas fa-box"></i> Cylinder Storage</h3>
              <ul>
                <li><i className="fas fa-check"></i> Store cylinders in a well-ventilated area</li>
                <li><i className="fas fa-check"></i> Keep away from heat sources and sunlight</li>
                <li><i className="fas fa-check"></i> Store upright and secure to prevent tipping</li>
                <li><i className="fas fa-check"></i> Keep away from flammable materials</li>
                <li><i className="fas fa-check"></i> Do not store in basements or below ground level</li>
              </ul>
            </div>
          </div>
          
          <div className="safety-card">
            <div className="safety-img">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Appliance Usage"
              />
            </div>
            <div className="safety-content">
              <h3><i className="fas fa-fire"></i> Appliance Usage</h3>
              <ul>
                <li><i className="fas fa-check"></i> Use only approved gas appliances</li>
                <li><i className="fas fa-check"></i> Ensure proper ventilation when in use</li>
                <li><i className="fas fa-check"></i> Never leave cooking unattended</li>
                <li><i className="fas fa-check"></i> Turn off appliances after use</li>
                <li><i className="fas fa-check"></i> Keep flammable items away from burners</li>
              </ul>
            </div>
          </div>
          
          <div className="safety-card">
            <div className="safety-img">
              <img
                src="https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Leak Detection"
              />
            </div>
            <div className="safety-content">
              <h3><i className="fas fa-exclamation-triangle"></i> Leak Detection</h3>
              <ul>
                <li><i className="fas fa-check"></i> Regularly check connections for leaks</li>
                <li><i className="fas fa-check"></i> Use soapy water to check for bubbles indicating leaks</li>
                <li><i className="fas fa-check"></i> Never use a flame to check for leaks</li>
                <li><i className="fas fa-check"></i> If you smell gas, turn off supply immediately</li>
                <li><i className="fas fa-check"></i> Evacuate area if leak is suspected</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Emergency Section */}
        <div className="emergency-section">
          <h2><i className="fas fa-exclamation-circle"></i> Emergency Procedures</h2>
          <p>In case of a gas leak or emergency, follow these steps immediately:</p>
          
          <div className="emergency-steps">
            <div className="emergency-step">
              <h3><i className="fas fa-1"></i> Turn Off Supply</h3>
              <p>Close the cylinder valve immediately to stop the flow of gas.</p>
            </div>
            
            <div className="emergency-step">
              <h3><i className="fas fa-2"></i> Eliminate Ignition Sources</h3>
              <p>Extinguish all flames, avoid switching electrical devices on or off.</p>
            </div>
            
            <div className="emergency-step">
              <h3><i className="fas fa-3"></i> Ventilate Area</h3>
              <p>Open all doors and windows to allow gas to disperse.</p>
            </div>
            
            <div className="emergency-step">
              <h3><i className="fas fa-4"></i> Evacuate & Call for Help</h3>
              <p>Leave the area and call our emergency line: <strong>+234 123 456 7890</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="faq-section">
        <h2 className="section-title">Safety Frequently Asked Questions</h2>
        
        <div className={`faq-item ${activeFaq === 0 ? 'faq-active' : ''}`}>
          <div className="faq-question" onClick={() => toggleFaq(0)}>
            What should I do if I smell gas? <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>If you smell gas: 1) Extinguish all open flames immediately, 2) Do not operate electrical switches, 3) Open doors and windows for ventilation, 4) Turn off the gas supply at the cylinder, 5) Leave the area and call our emergency line for assistance.</p>
          </div>
        </div>
        
        <div className={`faq-item ${activeFaq === 1 ? 'faq-active' : ''}`}>
          <div className="faq-question" onClick={() => toggleFaq(1)}>
            How often should I have my gas appliances serviced? <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Gas appliances should be serviced at least once a year by a qualified technician. Regular maintenance ensures safe operation, efficiency, and extends the lifespan of your appliances.</p>
          </div>
        </div>
        
        <div className={`faq-item ${activeFaq === 2 ? 'faq-active' : ''}`}>
          <div className="faq-question" onClick={() => toggleFaq(2)}>
            Can I store my gas cylinder indoors? <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Gas cylinders should never be stored indoors. They must be kept in a well-ventilated outdoor area, away from heat sources, direct sunlight, and flammable materials. Cylinders should be stored upright and secured to prevent tipping.</p>
          </div>
        </div>
        
        <div className={`faq-item ${activeFaq === 3 ? 'faq-active' : ''}`}>
          <div className="faq-question" onClick={() => toggleFaq(3)}>
            What is the safe distance between gas cylinders and heat sources? <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Gas cylinders should be kept at least 3 meters (10 feet) away from heat sources, including stoves, heaters, and direct sunlight. Never place cylinders near open flames or electrical equipment that could generate sparks.</p>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <h2>Stay Safe with e-GAS</h2>
        <p>Our certified technicians are available to inspect your gas equipment and ensure everything is operating safely.</p>
        <Link to="/contact" className="cta-button">Schedule Safety Inspection</Link>
      </section>
    </div>
  );
};

export default SafetyGuidelines;