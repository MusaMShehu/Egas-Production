// components/QuickLinks.js
import React from 'react';
// import '../pages/blogs/Blog';
// import '../pages/business/Business';
// import '../pages/Careers/Careers';
// import '../pages/Customer Testimonials/CustomerTestimonials';
// import '../pages/Delivery_Team/delivery-team';
// import '../pages/Domestic Solutions/DomesticSolutions';
// import '../pages/FAQ/FAQ';
// import '../pages/Learn More/learnMore';
// import '../pages/Maintenace Services/MaintenanceServices';
// import '../pages/Pricing Plans/PricingPlans';
// import '../pages/Restaurant Solutions/RestaurantSolutions';
// import '../pages/Safety Guidelines/SafetyGuidelines';

const QuickLinks = () => {
  const linkItems = [
    {
      title: "Our Delivery Team",
      image: "./images/egas1",
      link: "Blog.html"
    },
    {
      title: "Maintenance",
      image: "images/bg image 1.jpg",
      link: "MaintenanceServices.html"
    },
    {
      title: "Safety Guidelines",
      image: "images/images 48.jpg",
      link: "SafetyGuidelines.html"
    },
    {
      title: "Pricing Plans",
      image: "images/image 49.jpg",
      link: "PricingPlan.html"
    },
    {
      title: "Customer Testimonials",
      image: "images/image 50.jpg",
      link: "CustomerTestimonials.html"
    },
    {
      title: "FAQ",
      image: "images/image 52.jpg",
      link: "FAQ"
    },
    {
      title: "Our Blog",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80",
      link: "blog.js"
    },
    {
      title: "Careers",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "careers.html"
    }
  ];

  return (
    <section className="quick-links">
      <h4>QUICK LINKS</h4>
      <p>
        Navigate through our website to find the best product that suit your preferences and plan, 
        subscribe to the plan that you want or customize plan according to your budget, kitchen size and supply frequency.
      </p>
      <div className="link-grid">
        {linkItems.map((item, index) => (
          <div 
            key={index} 
            className="link-item" 
            onClick={() => window.location.href = item.link}
          >
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;