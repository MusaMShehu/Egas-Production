import React, { useState } from 'react';
import { Link, } from 'react-router-dom';
import './RestaurantSolutions.css'; 

const RestaurantSolutions = () => {

  return (
    <div className="rest-restaurant-page">
      
      {/* ===== Page Header ===== */}
      <section className="rest-page-header">
        <h2>Restaurant Gas Solutions</h2>
        <p>Specialized high-volume gas delivery for restaurants and food service businesses. Never worry about interrupting your service.</p>
      </section>

      {/* ===== Breadcrumb ===== */}
      <div className="rest-breadcrumb">
        <Link to="/">Home</Link> 
        <Link to="/opportunities">Learn More</Link>
        Restaurant Solutions
      </div>

      {/* ===== Content Section ===== */}
      <section className="rest-content-section">
        <h2 className="rest-section-title">Designed for Food Service Businesses</h2>
        
        <div className="rest-two-column">
          <div className="rest-column-img">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Restaurant Kitchen"
            />
          </div>
          <div className="rest-column-text">
            <h3>Keep Your Kitchen Running</h3>
            <p>
              For restaurants, consistent gas supply isn't just a convenience, it's essential for business operations. Our restaurant solutions are designed to ensure you never run out of gas during peak hours.
            </p>
            <p>
              We understand the unique demands of food service businesses, which is why we offer specialized high-volume cylinders, flexible delivery schedules, and emergency support to keep your kitchen running smoothly.
            </p>
          </div>
        </div>
        
        <h3 className="rest-section-title">Benefits for Restaurants</h3>
        
        <div className="rest-benefits-grid">
          <div className="rest-benefit-item">
            <div className="rest-benefit-icon">
              <i className="rest-fas fa-fire"></i>
            </div>
            <h4>High-Volume Cylinders</h4>
            <p>Specialized cylinders designed for commercial kitchen usage.</p>
          </div>
          
          <div className="rest-benefit-item">
            <div className="rest-benefit-icon">
              <i className="rest-fas fa-clock"></i>
            </div>
            <h4>Flexible Scheduling</h4>
            <p>Delivery times tailored to your business hours.</p>
          </div>
          
          <div className="rest-benefit-item">
            <div className="rest-benefit-icon">
              <i className="rest-fas fa-bolt"></i>
            </div>
            <h4>Emergency Support</h4>
            <p>24/7 emergency delivery for unexpected shortages.</p>
          </div>
          
          <div className="rest-benefit-item">
            <div className="rest-benefit-icon">
              <i className="rest-fas fa-chart-line"></i>
            </div>
            <h4>Usage Analytics</h4>
            <p>Detailed reports to help optimize your consumption.</p>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="rest-features-section">
        <h2 className="rest-section-title">Our Restaurant Services</h2>
        
        <div className="rest-features-grid">
          <div className="rest-feature-card">
            <div className="rest-feature-img">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80"
                alt="Commercial Cylinders"
              />
            </div>
            <div className="rest-feature-content">
              <h3>Commercial Cylinders</h3>
              <p>High-capacity cylinders designed specifically for commercial kitchens with heavy usage demands.</p>
            </div>
          </div>
          
          <div className="rest-feature-card">
            <div className="rest-feature-img">
              <img
                src="https://media.istockphoto.com/id/1325047322/photo/liquefied-gas-storage-workers-carrying-gas-cylinder-on-staircase.webp?a=1&b=1&s=612x612&w=0&k=20&c=-dU7aXM83EPSL20CXvu5LiEWTV9hFrprc7Y3KkwNu5k="
                alt="Scheduled Delivery"
              />
            </div>
            <div className="rest-feature-content">
              <h3>Scheduled Delivery</h3>
              <p>Regular deliveries scheduled during off-peak hours to minimize disruption to your operations.</p>
            </div>
          </div>
          
          <div className="rest-feature-card">
            <div className="rest-feature-img">
              <img
                src="https://media.istockphoto.com/id/2148415290/photo/close-up-of-the-knobs-on-the-restaurant-stoves.webp?a=1&b=1&s=612x612&w=0&k=20&c=D8ctG_K-py4Ttz34p68wiZbAj-seIY5vW4hFnDlozO4="
                alt="Equipment Maintenance"
              />
            </div>
            <div className="rest-feature-content">
              <h3>Equipment Maintenance</h3>
              <p>Regular maintenance and safety checks for all your gas equipment by certified technicians.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials Section ===== */}
      {/* <section className="rest-testimonials-section">
        <h2 className="rest-section-title">What Restaurant Owners Say</h2>
        
        <div className="rest-testimonials-grid">
          <div className="rest-testimonial-card">
            <div className="rest-testimonial-text">
              <p>"Since switching to e-GAS, we've never had to worry about running out of gas during dinner service. Their emergency delivery has saved us multiple times."</p>
            </div>
            <div className="rest-testimonial-author">
              <div className="rest-author-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Chef Michael" />
              </div>
              <div className="rest-author-details">
                <h4>Michael Adeyemi</h4>
                <p>Head Chef, Spice Garden</p>
              </div>
            </div>
          </div>
          
          <div className="rest-testimonial-card">
            <div className="rest-testimonial-text">
              <p>"The usage analytics helped us optimize our gas consumption, saving us over 20% on our monthly gas expenses. Highly recommended for any restaurant."</p>
            </div>
            <div className="rest-testimonial-author">
              <div className="rest-author-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Manager Sarah" />
              </div>
              <div className="rest-author-details">
                <h4>Sarah Johnson</h4>
                <p>Manager, City Bistro</p>
              </div>
            </div>
          </div>
          
          <div className="rest-testimonial-card">
            <div className="rest-testimonial-text">
              <p>"As a chain of restaurants, we needed a reliable gas supplier that could service all our locations consistently. e-GAS has delivered perfectly."</p>
            </div>
            <div className="rest-testimonial-author">
              <div className="rest-author-avatar">
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Owner David" />
              </div>
              <div className="rest-author-details">
                <h4>David Okon</h4>
                <p>Owner, Taste of Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ===== CTA Section ===== */}
      <section className="rest-cta-section">
        <h2>Power Your Restaurant with Reliable Gas Supply</h2>
        <p>
          Join hundreds of restaurants that trust e-GAS for their cooking needs. Sign up today and get your first month at discounted rate!
        </p>
        <Link to="/auth" className="rest-cta-button">
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

export default RestaurantSolutions;