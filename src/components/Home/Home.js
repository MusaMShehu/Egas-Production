// src/components/Home.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Hero from './Hero';
import Opportunities from './Opportunities';
import QuickLinks from './QuickLinks';
import '../../styles/Home.css';

const Home = () => {
  return (
    <div>
      <Hero />
      <Opportunities />
      <QuickLinks />
    </div>
  );
};

export default Home;