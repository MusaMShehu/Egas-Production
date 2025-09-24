// components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <h2>e-GAS</h2>
      <h3>ONLINE GAS SUPPLY</h3>
      <p>
        Reliable gas to be delivered to your doorstep, we provide high-quality and affordable gas to homes, businesses, and restaurants. 
        You can order your gas directly here or subscribe to a routine plan without hassle of re-ordering which will be delivered 
        to your doorstep at the scheduled time.
      </p>
      <button onClick={() => window.location.href = 'register.html'}>
        Register Now
      </button>
    </section>
  );
};

export default Hero;