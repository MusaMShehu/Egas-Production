// src/App.js (updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import Services from './components/Services';
import Contact from './components/Contact';
import About from './components/About';
import Blog from './pages/blog/Blog';
import Business from './pages/business/Business';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/business" element={<Business />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;