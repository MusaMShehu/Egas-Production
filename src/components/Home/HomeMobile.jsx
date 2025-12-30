// src/components/Home.js
import React from 'react';
import HeroMobile from './HeroMobile';
import OpportunitiesMobile from './OpportunitiesMobile';
import QuickLinksMobile from './QuickLinksMobile';
import './HomeMobileComponents.css';

const Home = () => {
  return (
    <div className="hmc-mobile-home-container">
      <HeroMobile />
      <OpportunitiesMobile />
      <QuickLinksMobile />
    </div>
  );
};

export default Home;