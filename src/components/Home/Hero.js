// components/Hero.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an auth context

const Hero = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  
  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard/overview');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="hero">
      <h2>e-GAS</h2>
      <h3>ONLINE GAS SUPPLY</h3>
      <p>
        We deliver reliable, high-quality, and affordable gas to homes, businesses, and restaurants. 
        Order instantly or subscribe for routine doorstep delivery
      </p>
      <button onClick={handleGetStarted}>
        Get Started
      </button>
    </section>
  );
};

export default Hero;