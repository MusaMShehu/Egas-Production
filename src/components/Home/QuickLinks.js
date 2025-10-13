// components/QuickLinks.js
import React from 'react';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  const linkItems = [
    {
      title: "Our Delivery Team",
      image:'https://media.istockphoto.com/id/1299951556/photo/modern-liquified-gas-storage-workers-carrying-heavy-gas-cylinder-up-stairs.jpg?s=612x612&w=0&k=20&c=-dcWwmqdij90yS811x6wMhlJLFVKEoayhEOeEbnjqyk=',
      path: "/delivery-team"
    },
    {
      title: "Maintenance",
      image: "https://media.istockphoto.com/id/1305516984/photo/dark-skinned-service-man-standing-near-the-gas-stove-in-the-kitchen.jpg?s=612x612&w=0&k=20&c=JpXktXsHTlFgGsBij9dIi1Yf8opLmHsyGM4OhqpRK0g=",
      path: "/maintenance-services"
    },
    {
      title: "Safety Guidelines",
      image: "https://media.istockphoto.com/id/1388584329/photo/image-of-safety-warning-sign-on-kitchen-4-burner-gas-hob-stove-dirty-stainless-steel-surface.jpg?s=612x612&w=0&k=20&c=JVvUP_yVY_peMTlyLP1Fp5DQVY-XaXLBC8WVap1XyEI=",
      path: "/safety-guidelines"
    },
    {
      title: "Pricing Plans",
      image: "/images/Pricing.jpg",
      path: "/pricing-plans"
    },
    {
      title: "Customer Testimonials",
      image: "https://media.istockphoto.com/id/1290521018/photo/sister-showing-something-on-smartphone-to-her-father-at-home.jpg?s=612x612&w=0&k=20&c=fJrSTxKxVLUI5KeQz9icMggho47NHbxa0mkm7fy2tuk=",
      path: "/customer-testimonials"
    },
    {
      title: "FAQ",
      image: "/images/FAQ.jpg",
      path: "/faq"
    },
    {
      title: "Our Blog",
      image: "https://media.istockphoto.com/id/1251668084/photo/african-american-blogger-posting-online-via-laptop-on-sofa-at-home-collage.jpg?s=612x612&w=0&k=20&c=af8oIMxjcJtSxLJ24ojPK6CxSqU0psky-0nEpefBenM=",
      path: "/blog"
    },
    {
      title: "Careers",
      image: "https://media.istockphoto.com/id/2184686650/photo/power-plant-worker-using-scada-system.jpg?s=612x612&w=0&k=20&c=1W22iM2J23wPdEvCWIDCsQ2gbFB5DmQ4eZbKkwAAwd0=",
      path: "/careers"
    }
  ];

  // Fallback image in case the image fails to load
  const handleImageError = (e) => {
    e.target.src = '/images/logo.png'; // Add a placeholder image
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