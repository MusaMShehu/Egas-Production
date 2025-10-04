// components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <h2>e-GAS</h2>
      <h3>ONLINE GAS SUPPLY</h3>
      <p>
        We deliver reliable, high-quality, and affordable gas to homes, businesses, and restaurants. 
        Order instantly or subscribe for routine doorstep delivery
      </p>
      <button onClick={() => window.location.href = 'register.html'}>
        Get Started
      </button>
    </section>
  );
};

export default Hero;