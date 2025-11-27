import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBox, 
  FaFire, 
  FaExclamationTriangle, 
  FaTruck, 
  FaTools, 
  FaChild, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaExclamationCircle, 
  FaSkullCrossbones, 
  FaChevronUp, 
  FaChevronDown,
  FaCheck,
  FaHome,
  FaArrowRight
} from 'react-icons/fa';
import './SafetyGuidelines.css';

const SafetyGuidelines = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="safety-page">
      
      {/* ===== Page Header ===== */}
      <section className="safety-page-header">
        <div className="safety-header-content">
          <h1>LPG Safety Guidelines</h1>
          <p>Comprehensive safety information for proper handling, storage, and use of LPG cylinders and equipment</p>
        </div>
      </section>

      {/* ===== Breadcrumb ===== */}
      <nav className="safety-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome className="safety-breadcrumb-icon" /> Home</Link>
        <span className="safety-breadcrumb-separator"><FaArrowRight /></span>
        <Link to="/quick-links">Quick Links</Link>
        <span className="safety-breadcrumb-separator"><FaArrowRight /></span>
        <span className="safety-current-page">Safety Guidelines</span>
      </nav>

      {/* ===== Safety Overview ===== */}
      <section className="safety-overview">
        <div className="safety-container">
          <div className="safety-overview-content">
            <h2>Why LPG Safety Matters</h2>
            <p>LPG (Liquefied Petroleum Gas) is highly efficient but requires proper handling. Following these guidelines ensures your safety and prevents accidents.</p>
          </div>
        </div>
      </section>

      {/* ===== Main Safety Guidelines ===== */}
      <section className="safety-main-guidelines">
        <div className="safety-container">
          <h2 className="safety-section-title">Essential Safety Guidelines</h2>
          
          <div className="safety-grid">
            {/* Cylinder Storage */}
            <div className="safety-card">
              <div className="safety-img">
                <img
                  src="https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Proper LPG cylinder storage"
                  loading="lazy"
                />
              </div>
              <div className="safety-content">
                <h3><FaBox className="safety-icon" /> Cylinder Storage</h3>
                <ul>
                  <li><FaCheck className="safety-check-icon" /> Store in well-ventilated, upright position</li>
                  <li><FaCheck className="safety-check-icon" /> Keep away from heat sources and direct sunlight</li>
                  <li><FaCheck className="safety-check-icon" /> Secure cylinders to prevent tipping over</li>
                  <li><FaCheck className="safety-check-icon" /> Maintain minimum 3-meter distance from flammable materials</li>
                  <li><FaCheck className="safety-check-icon" /> Never store in basements or below ground level</li>
                  <li><FaCheck className="safety-check-icon" /> Keep storage area dry and corrosion-free</li>
                  <li><FaCheck className="safety-check-icon" /> Store away from electrical panels and switches</li>
                </ul>
              </div>
            </div>
            
            {/* Appliance Usage */}
            <div className="safety-card">
              <div className="safety-img">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Safe LPG appliance usage"
                  loading="lazy"
                />
              </div>
              <div className="safety-content">
                <h3><FaFire className="safety-icon" /> Appliance Usage</h3>
                <ul>
                  <li><FaCheck className="safety-check-icon" /> Use only certified LPG appliances</li>
                  <li><FaCheck className="safety-check-icon" /> Ensure proper ventilation during use</li>
                  <li><FaCheck className="safety-check-icon" /> Never leave cooking unattended</li>
                  <li><FaCheck className="safety-check-icon" /> Turn off appliances immediately after use</li>
                  <li><FaCheck className="safety-check-icon" /> Keep flammable items away from burners</li>
                  <li><FaCheck className="safety-check-icon" /> Regular maintenance by qualified technicians</li>
                  <li><FaCheck className="safety-check-icon" /> Check for yellow flames (indicates incomplete combustion)</li>
                </ul>
              </div>
            </div>
            
            {/* Leak Detection */}
            <div className="safety-card">
              <div className="safety-img">
                <img
                  src="https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="LPG leak detection methods"
                  loading="lazy"
                />
              </div>
              <div className="safety-content">
                <h3><FaExclamationTriangle className="safety-icon" /> Leak Detection</h3>
                <ul>
                  <li><FaCheck className="safety-check-icon" /> Regularly inspect connections and hoses</li>
                  <li><FaCheck className="safety-check-icon" /> Use soap solution to check for bubbles at connections</li>
                  <li><FaCheck className="safety-check-icon" /> Never use open flame to detect leaks</li>
                  <li><FaCheck className="safety-check-icon" /> Install gas leak detectors for early warning</li>
                  <li><FaCheck className="safety-check-icon" /> Recognize the distinctive odor added to LPG</li>
                  <li><FaCheck className="safety-check-icon" /> Check for hissing sounds near gas lines</li>
                </ul>
              </div>
            </div>

            {/* Transportation Safety */}
            <div className="safety-card">
              <div className="safety-img">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Safe LPG cylinder transportation"
                  loading="lazy"
                />
              </div>
              <div className="safety-content">
                <h3><FaTruck className="safety-icon" /> Transportation</h3>
                <ul>
                  <li><FaCheck className="safety-check-icon" /> Transport cylinders in upright position</li>
                  <li><FaCheck className="safety-check-icon" /> Secure cylinders during transit</li>
                  <li><FaCheck className="safety-check-icon" /> Ensure vehicle ventilation</li>
                  <li><FaCheck className="safety-check-icon" /> No smoking in vehicle during transport</li>
                  <li><FaCheck className="safety-check-icon" /> Avoid direct sunlight during transport</li>
                  <li><FaCheck className="safety-check-icon" /> Use proper handling equipment</li>
                </ul>
              </div>
            </div>

            {/* Installation Guidelines */}
            <div className="safety-card">
              <div className="safety-img">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Proper LPG installation"
                  loading="lazy"
                />
              </div>
              <div className="safety-content">
                <h3><FaTools className="safety-icon" /> Installation</h3>
                <ul>
                  <li><FaCheck className="safety-check-icon" /> Use only certified regulators and hoses</li>
                  <li><FaCheck className="safety-check-icon" /> Ensure tight connections without over-tightening</li>
                  <li><FaCheck className="safety-check-icon" /> Check hose condition regularly for cracks</li>
                  <li><FaCheck className="safety-check-icon" /> Replace hoses every 5 years or when damaged</li>
                  <li><FaCheck className="safety-check-icon" /> Keep hoses away from hot surfaces</li>
                  <li><FaCheck className="safety-check-icon" /> Install in easily accessible locations</li>
                </ul>
              </div>
            </div>

            {/* Children & Pet Safety */}
            <div className="safety-card">
              <div className="safety-img">
                <img
                  src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1460&q=80"
                  alt="Child and pet safety around LPG"
                  loading="lazy"
                />
              </div>
              <div className="safety-content">
                <h3><FaChild className="safety-icon" /> Child & Pet Safety</h3>
                <ul>
                  <li><FaCheck className="safety-check-icon" /> Keep children away from gas equipment</li>
                  <li><FaCheck className="safety-check-icon" /> Use child-safe knobs when possible</li>
                  <li><FaCheck className="safety-check-icon" /> Educate children about gas safety</li>
                  <li><FaCheck className="safety-check-icon" /> Secure cylinders from tampering</li>
                  <li><FaCheck className="safety-check-icon" /> Never leave children unattended near gas appliances</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Do's and Don'ts ===== */}
      <section className="safety-dos-donts-section">
        <div className="safety-container">
          <h2 className="safety-section-title">Do's and Don'ts</h2>
          <div className="safety-dos-donts-grid">
            <div className="safety-dos-section">
              <h3><FaThumbsUp className="safety-icon" /> Do's</h3>
              <ul>
                <li>Do check for leaks regularly</li>
                <li>Do keep the area well ventilated</li>
                <li>Do turn off regulator after use</li>
                <li>Do use approved LPG appliances</li>
                <li>Do keep fire extinguisher nearby</li>
                <li>Do store cylinders upright</li>
                <li>Do call professionals for repairs</li>
              </ul>
            </div>
            <div className="safety-donts-section">
              <h3><FaThumbsDown className="safety-icon" /> Don'ts</h3>
              <ul>
                <li>Don't use damaged cylinders</li>
                <li>Don't smoke near LPG equipment</li>
                <li>Don't attempt DIY repairs</li>
                <li>Don't store near heat sources</li>
                <li>Don't use in confined spaces</li>
                <li>Don't tamper with safety devices</li>
                <li>Don't use for purposes other than intended</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Emergency Procedures ===== */}
      <section className="safety-emergency-section">
        <div className="safety-container">
          <h2 className="safety-section-title"><FaExclamationCircle className="safety-icon" /> Emergency Procedures</h2>
          <p className="safety-emergency-intro">In case of a gas leak or emergency, follow these steps immediately:</p>
          
          <div className="safety-emergency-steps">
            <div className="safety-emergency-step">
              <div className="safety-step-number">1</div>
              <h3>Turn Off Supply</h3>
              <p>Close the cylinder valve immediately to stop gas flow. Turn off all appliance knobs.</p>
            </div>
            
            <div className="safety-emergency-step">
              <div className="safety-step-number">2</div>
              <h3>Eliminate Ignition Sources</h3>
              <p>Extinguish all flames. Don't operate electrical switches, appliances, or phones.</p>
            </div>
            
            <div className="safety-emergency-step">
              <div className="safety-step-number">3</div>
              <h3>Ventilate Area</h3>
              <p>Open all doors and windows to allow gas to disperse naturally.</p>
            </div>
            
            <div className="safety-emergency-step">
              <div className="safety-step-number">4</div>
              <h3>Evacuate & Call for Help</h3>
              <p>Leave the area immediately and call emergency services: <strong>+234 123 456 7890</strong></p>
            </div>
          </div>

          <div className="safety-emergency-warning">
            <h4><FaSkullCrossbones className="safety-warning-icon" /> Critical Warnings</h4>
            <ul>
              <li>Never ignore the smell of gas</li>
              <li>Do not attempt to locate the leak with a flame</li>
              <li>Do not re-enter the area until declared safe</li>
              <li>Do not use elevators during evacuation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="safety-faq-section">
        <div className="safety-container">
          <h2 className="safety-section-title">Safety Frequently Asked Questions</h2>
          
          <div className="safety-faq-list">
            {[
              {
                question: "What should I do if I smell gas?",
                answer: "If you smell gas: 1) Extinguish all open flames immediately, 2) Do not operate electrical switches or appliances, 3) Open doors and windows for ventilation, 4) Turn off the gas supply at the cylinder, 5) Leave the area immediately and call our emergency line for assistance from a safe distance."
              },
              {
                question: "How often should I have my gas appliances serviced?",
                answer: "Gas appliances should be serviced at least once a year by a qualified technician. Regular maintenance ensures safe operation, improves efficiency, and extends the lifespan of your appliances. Additionally, check hoses and connections monthly for signs of wear or damage."
              },
              {
                question: "Can I store my gas cylinder indoors?",
                answer: "No, gas cylinders should never be stored indoors. They must be kept in a well-ventilated outdoor area, away from heat sources, direct sunlight, and flammable materials. Cylinders should be stored upright and secured to prevent tipping. Indoor storage can lead to dangerous gas accumulation in case of leaks."
              },
              {
                question: "What is the safe distance between gas cylinders and heat sources?",
                answer: "Gas cylinders should be kept at least 3 meters (10 feet) away from heat sources, including stoves, heaters, and direct sunlight. Never place cylinders near open flames or electrical equipment that could generate sparks. Maintain clear access to cylinders at all times."
              },
              {
                question: "How can I safely check for gas leaks?",
                answer: "Safely check for leaks by applying soapy water to connections and hoses. If bubbles form, there's a leak. Never use a flame to check for leaks. You can also install gas leak detectors for continuous monitoring. If you suspect a leak, turn off the supply and contact a professional immediately."
              },
              {
                question: "What should I do if my LPG cylinder catches fire?",
                answer: "If safe to do so, turn off the gas supply. Evacuate immediately and call emergency services. Do not attempt to extinguish the fire unless you are trained. Never move a burning cylinder. Keep everyone at a safe distance until professionals arrive."
              }
            ].map((faq, index) => (
              <div key={index} className={`safety-faq-item ${activeFaq === index ? 'safety-faq-active' : ''}`}>
                <button className="safety-faq-question" onClick={() => toggleFaq(index)} aria-expanded={activeFaq === index}>
                  {faq.question}
                  {activeFaq === index ? <FaChevronUp className="safety-faq-arrow" /> : <FaChevronDown className="safety-faq-arrow" />}
                </button>
                <div className="safety-faq-answer" aria-hidden={activeFaq !== index}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="safety-cta-section">
        <div className="safety-container">
          <div className="safety-cta-content">
            <h2>Ensure Your Safety with Professional Inspection</h2>
            <p>Our certified technicians are available to inspect your gas equipment and ensure everything is operating safely and efficiently.</p>
            <div className="safety-cta-buttons">
              <Link to="/contact" className="safety-cta-button safety-primary">Schedule Safety Inspection</Link>
              <Link to="/resources" className="safety-cta-button safety-secondary">Download Safety Checklist</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyGuidelines;