import React, { useState } from 'react';
import './DeliveryTeam.css';

const DeliveryTeam = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Enhanced team member data
  const teamMembers = [
    {
      id: 1,
      name: "Abubakar Abdulhamid",
      role: "Lead Delivery Coordinator",
      description: "With over 8 years of experience, Abubakar ensures all deliveries are efficiently routed and completed on time.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      certifications: ["HSE Certified", "Logistics Management", "First Aid Trained"],
      experience: "8 years"
    },
    {
      id: 2,
      name: "Aminu Ali",
      role: "Safety Officer",
      description: "Aminu ensures all safety protocols are followed during delivery and handling of gas cylinders.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      certifications: ["OSHA Certified", "Safety Management", "Emergency Response"],
      experience: "6 years"
    },
    {
      id: 3,
      name: "Zakariyya Abdullahi",
      role: "Senior Delivery Driver",
      description: "Zakariyya has been with e-GAS for 2 years and knows the city routes like the back of his hand.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      certifications: ["Defensive Driving", "Hazardous Materials", "Vehicle Maintenance"],
      experience: "2 years"
    },
    {
      id: 4,
      name: "Hauwa Mohammed",
      role: "Customer Relations Specialist",
      description: "Hauwa ensures customers are satisfied with their delivery experience and handles any special requests.",
      image: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      certifications: ["Customer Service Excellence", "Conflict Resolution", "CRM Specialist"],
      experience: "4 years"
    }
  ];

  // Enhanced stats data
  const stats = [
    { number: "98%", label: "On-Time Delivery Rate", description: "Across all delivery zones" },
    { number: "1,000+", label: "Happy Customers", description: "Served this year" },
    { number: "24/7", label: "Delivery Support", description: "Emergency delivery available" },
    { number: "15", label: "Professional Team Members", description: "Fully trained and certified" },
    { number: "30min", label: "Average Response Time", description: "For urgent deliveries" },
    { number: "100%", label: "Safety Record", description: "Zero major incidents" }
  ];

  // Delivery process steps
  const deliveryProcess = [
    {
      step: 1,
      title: "Order Placement",
      description: "Place your order through our app or website. Receive instant confirmation and estimated delivery time.",
      icon: "📱",
      duration: "Instant"
    },
    {
      step: 2,
      title: "Order Processing",
      description: "Our team verifies your order, checks your location, and assigns the nearest delivery vehicle.",
      icon: "⚡",
      duration: "15-30 minutes"
    },
    {
      step: 3,
      title: "Route Optimization",
      description: "Advanced GPS routing ensures the most efficient path to your location, considering traffic and other deliveries.",
      icon: "🗺️",
      duration: "5 minutes"
    },
    {
      step: 4,
      title: "Safe Transportation",
      description: "LPG Gas are securely stored in specially designed vehicles with safety compartments and monitoring systems.",
      icon: "🚚",
      duration: "Varies by location"
    },
    {
      step: 5,
      title: "Professional Delivery",
      description: "Trained delivery personnel handle installation and safety checks at your premises with contactless options available.",
      icon: "👨‍💼",
      duration: "10-15 minutes"
    },
    {
      step: 6,
      title: "Quality Assurance",
      description: "Post-delivery follow-up to ensure customer satisfaction and schedule any additional services needed.",
      icon: "✅",
      duration: "24-hour follow-up"
    }
  ];

  // Service areas
  const serviceAreas = [
    {
      zone: "Metropolitan",
      deliveryTime: "1-2 hours",
      coverage: "Around the central Maiduguri",
      specialNotes: "24/7 emergency service available"
    },
    {
      zone: "Northern Suburbs",
      deliveryTime: "2-3 hours",
      coverage: "All northern metropolitan areas including Maimalari barracks and sorroundings",
      specialNotes: "Same-day delivery guaranteed"
    },
    {
      zone: "Southern Suburbs",
      deliveryTime: "2-3 hours",
      coverage: "All southern metropolitan areas including Part of Jere, Konduga and University of Maiduguri sorroundings and beyond",
      specialNotes: "Same-day delivery guaranteed"
    },
    {
      zone: "Western Area",
      deliveryTime: "3-4 hours",
      coverage: "Western districts and industrial areas and sorroundings up to Borno state University and beyond",
      specialNotes: "Bulk delivery discounts available"
    },
    {
      zone: "Eastern Metropolis",
      deliveryTime: "3-4 hours",
      coverage: "Eastern Maiduguri and Whole of Jere",
      specialNotes: "Same-day delivery guaranteed"
    }
  ];

  // Safety features
  const safetyFeatures = [
    "GPS-tracked delivery vehicles",
    "Real-time delivery tracking",
    "Safety-certified personnel",
    "Regular vehicle maintenance",
    "Emergency response protocol",
    "Contactless delivery option",
    "Digital documentation",
    "Quality control checks"
  ];

  return (
    <div className="del-team-delivery-team-page">

      {/* Page Header */}
      <section className="del-team-page-header">
        <h1>Delivery Information & Team</h1>
        <p>Comprehensive details about our delivery process, professional team, and how we ensure your gas reaches you safely and efficiently.</p>
      </section>

      {/* Breadcrumb */}
      <div className="del-team-breadcrumb">
        <a href="/">Home</a> 
        <span className="del-team-separator">/</span>
        <a href="/quick-links">Quick Links</a>  
        <span className="del-team-separator">/</span>
        <span className="del-team-current">Delivery Information</span>
      </div>

      {/* Delivery Process Section */}
      <section className="del-team-delivery-process-section">
        <h2 className="del-team-section-title">How Your Gas is Delivered</h2>
        <p className="del-team-section-subtitle">Our streamlined 6-step process ensures safe, reliable delivery every time</p>
        
        <div className="del-team-process-timeline">
          {deliveryProcess.map(step => (
            <div key={step.step} className="del-team-process-step">
              <div className="del-team-step-header">
                <div className="del-team-step-icon">{step.icon}</div>
                <div className="del-team-step-number">Step {step.step}</div>
              </div>
              <h3 className="del-team-step-title">{step.title}</h3>
              <p className="del-team-step-description">{step.description}</p>
              <div className="del-team-step-duration">
                <strong>Duration:</strong> {step.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="del-team-service-areas-section">
        <h2 className="del-team-section-title">Our Service Coverage</h2>
        <p className="del-team-section-subtitle">We deliver across multiple zones with guaranteed timeframes</p>
        
        <div className="del-team-areas-grid">
          {serviceAreas.map((area, index) => (
            <div key={index} className="del-team-area-card">
              <h3 className="area-zone">{area.zone}</h3>
              <div className="del-team-area-delivery-time">
                <span className="del-team-time-badge">{area.deliveryTime}</span>
              </div>
              <p className="del-team-area-coverage"><strong>Coverage:</strong> {area.coverage}</p>
              <p className="del-team-area-notes"><strong>Notes:</strong> {area.specialNotes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="del-team-team-section">
        <h2 className="del-team-section-title">Meet Our Delivery Experts</h2>
        <p className="del-team-section-subtitle">Our certified professionals are trained in safety protocols and customer service excellence</p>
        
        <div className="del-team-team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="del-team-team-member">
              <div className="del-team-member-img">
                <img src={member.image} alt={member.name} />
                <div className="del-team-experience-badge">{member.experience}</div>
              </div>
              <div className="del-team-member-info">
                <h3>{member.name}</h3>
                <div className="del-team-member-role">{member.role}</div>
                <p>{member.description}</p>
                
                <div className="del-team-certifications">
                  <h4>Certifications:</h4>
                  <div className="del-team-certification-tags">
                    {member.certifications.map((cert, index) => (
                      <span key={index} className="del-team-cert-tag">{cert}</span>
                    ))}
                  </div>
                </div>
                
                <div className="del-team-member-social">
                  <a href="https://linkedin.com" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://x.com" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="del-team-safety-section">
        <h2 className="del-team-section-title">Safety & Quality Assurance</h2>
        <div className="del-team-safety-content">
          <div className="del-team-safety-text">
            <h3>Our Commitment to Safety</h3>
            <p>We prioritize safety in every aspect of our delivery process. All our personnel undergo rigorous training and our vehicles are equipped with the latest safety features.</p>
            
            <div className="del-team-safety-features">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="del-team-safety-feature">
                  <span className="del-team-safety-check">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <div className="del-team-safety-image">
            <img src="https://images.unsplash.com/photo-1581093450332-63b830d2671c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Safety Procedures" />
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="del-team-stats-section">
        <h2 className="del-team-section-title">Our Delivery Excellence</h2>
        
        <div className="del-team-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="del-team-stat-item">
              <div className="del-team-stat-number">{stat.number}</div>
              <div className="del-team-stat-label">{stat.label}</div>
              <div className="del-team-stat-description">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="del-team-cta-section">
        <div className="del-team-cta-content">
          <h2>Ready for Reliable Gas Delivery?</h2>
          <p>Join thousands of satisfied customers who trust e-GAS for timely and safe gas delivery.</p>
          <div className="del-team-cta-buttons">
            <a href="/register" className="del-team-cta-button del-team-primary">Place Your Order Now</a>
            <a href="/contact" className="del-team-cta-button del-team-secondary">Contact Our Team</a>
          </div>
          <div className="del-team-cta-features">
            <div className="del-team-feature">✓ Same-day delivery available</div>
            <div className="del-team-feature">✓ Emergency 24/7 service</div>
            <div className="del-team-feature">✓ Competitive pricing</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryTeam;