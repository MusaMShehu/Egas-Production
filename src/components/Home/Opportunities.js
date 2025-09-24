// components/Opportunities.js
import React from 'react';

const Opportunities = () => {
  return (
    <section className="opportunities">
      <h3>Unlock boundless opportunities</h3>
      <p>
        We come with countless opportunities for domestic users, businesses and organizations. 
        With our customizable services, you can set up your plan according to your need, budget and time of delivery. 
        Also at e-gas we offer various services related to gas…
      </p>
      <button onClick={() => window.location.href = 'learn-more.html'}>
        Learn More
      </button>
    </section>
  );
};

export default Opportunities;