// src/components/About/About.js
import React from 'react';
// import Header from '../Header';
// import Footer from '../Footer';
import './About.css';

const About = () => {
  const missionCards = [
    {
      icon: "fas fa-bullseye",
      title: "Our Mission",
      description: "To provide safe, reliable, and affordable gas solutions to every Nigerian home and business, delivered with exceptional service and care for our community."
    },
    {
      icon: "fas fa-eye",
      title: "Our Vision",
      description: "To become Nigeria's most trusted energy partner, revolutionizing how households and businesses access cooking gas through innovative delivery solutions."
    },
    {
      icon: "fas fa-gem",
      title: "Our Values",
      description: "Safety, Reliability, Innovation, Customer Focus, and Community Responsibility guide everything we do at e-GAS."
    }
  ];

  const teamMembers = [
    {
      name: "Musa Mohammed Shehu",
      position: "Founder & CEO",
      bio: "With over 15 years in the energy sector, Musa founded e-GAS to solve Nigeria's gas distribution challenges.",
      image: "images/1755301847924.jpg"
    },
    {
      name: "Musa Shehu",
      position: "Operations Director",
      bio: "Musa oversees our nationwide delivery network, ensuring efficient and safe operations.",
      image: "images/1755302168417.jpg"
    },
    {
      name: "Musa Mohammed",
      position: "Customer Experience Manager",
      bio: "Musa leads our customer service team, committed to delivering exceptional support.",
      image: "images/1755302168398.jpg"
    },
    {
      name: "Fatima Bello",
      position: "Safety Director",
      bio: "Fatima ensures all our operations meet the highest safety standards in the industry.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  ];

  return (
    <div className="about-page">
      {/* <Header /> */}
      
      {/* About Hero Section */}
      <section className="page-hero">
        <h2>About e-GAS</h2>
        <p>Delivering quality gas solutions since 2015</p>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="about-container">
          <div className="about-text">
            <h3>Our Story</h3>
            <p>Founded in 2015, e-GAS began with a simple mission: to provide reliable, affordable gas delivery to homes and businesses across Nigeria. What started as a small operation with just two delivery trucks has grown into one of the most trusted names in gas distribution.</p>
            
            <p>Our founder, Mr. Musa Mohammed Shehu, recognized the challenges Nigerians faced in accessing quality cooking gas consistently. Long queues at gas stations, safety concerns, and unreliable supply were common problems. e-GAS was created to solve these issues through innovative delivery solutions and exceptional customer service.</p>
            
            <p>Today, we serve over 50,000 satisfied customers across Lagos, Abuja, and Port Harcourt, with plans to expand to more cities in the coming year.</p>
          </div>
          
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Our Team" />
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="mission-section">
        <div className="mission-container">
          {missionCards.map((card, index) => (
            <div key={index} className="mission-card">
              <i className={card.icon}></i>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-header">
          <h3>Meet Our Leadership Team</h3>
          <p>The dedicated professionals driving our success</p>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img src={member.image} alt={member.name} />
              <h4>{member.name}</h4>
              <p className="position">{member.position}</p>
              <p className="bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default About;