// components/QuickLinks.js
import React from 'react';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  const linkItems = [
    {
      title: "Our Delivery Team",
      image: "/images/Gas Delivery Team_simple_compose.png",
      path: "/delivery-team"
    },
    {
      title: "Maintenance",
      image: "/images/Gas Cylinder Inspection_simple_compose.png",
      path: "/maintenance-services"
    },
    {
      title: "Safety Guidelines",
      image: "/images/Safety-Checks.png",
      path: "/safety-guidelines"
    },
    {
      title: "Pricing Plans",
      image: "/images/Pricing.jpg",
      path: "/pricing-plans"
    },
    {
      title: "Customer Testimonials",
      image: "/images/Testimonials.jpg",
      path: "/customer-testimonials"
    },
    {
      title: "FAQ",
      image: "/images/FAQ.jpg",
      path: "/faq"
    },
    {
      title: "Our Blog",
      image: "/images/img24.jpg",
      path: "/blog"
    },
    {
      title: "Careers",
      image: "/images/careers.jpg",
      path: "/careers"
    }
  ];

  // Fallback image in case the image fails to load
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.jpg'; // Add a placeholder image
  };

  return (
    <section className="quick-links">
      <h4>QUICK LINKS</h4>
      <p>
        Navigate through our website to find the best product that suit your preferences and plan, 
        subscribe to the plan that you want or customize plan according to your budget, kitchen size and supply frequency.
      </p>
      <div className="link-grid">
        {linkItems.map((item, index) => (
          <Link key={index} to={item.path} className="link-item">
            <img src={item.image} alt={item.title}onError={handleImageError}/>
            <p>{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;