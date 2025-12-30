import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTruck, 
  FaWrench, 
  FaShieldAlt, 
  FaTags, 
  FaComments,
  FaQuestionCircle,
  FaBlog,
  FaBriefcase
} from 'react-icons/fa';

const QuickLinks = () => {
  const linkItems = [
    {
      title: "Our Delivery Team",
      icon: <FaTruck />,
      color: "#007bff",
      image: 'https://media.istockphoto.com/id/1299951556/photo/modern-liquified-gas-storage-workers-carrying-heavy-gas-cylinder-up-stairs.jpg?s=612x612&w=0&k=20&c=-dcWwmqdij90yS811x6wMhlJLFVKEoayhEOeEbnjqyk=',
      path: "/delivery-team"
    },
    {
      title: "Maintenance",
      icon: <FaWrench />,
      color: "#28a745",
      image: "https://media.istockphoto.com/id/1305516984/photo/dark-skinned-service-man-standing-near-the-gas-stove-in-the-kitchen.jpg?s=612x612&w=0&k=20&c=JpXktXsHTlFgGsBij9dIi1Yf8opLmHsyGM4OhqpRK0g=",
      path: "/maintenance-services"
    },
    {
      title: "Safety Guidelines",
      icon: <FaShieldAlt />,
      color: "#ffc107",
      image: "https://media.istockphoto.com/id/1388584329/photo/image-of-safety-warning-sign-on-kitchen-4-burner-gas-hob-stove-dirty-stainless-steel-surface.jpg?s=612x612&w=0&k=20&c=JVvUP_yVY_peMTlyLP1Fp5DQVY-XaXLBC8WVap1XyEI=",
      path: "/safety-guidelines"
    },
    {
      title: "Pricing Plans",
      icon: <FaTags />,
      color: "#6f42c1",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      path: "/pricing-plans"
    },
    {
      title: "Customer Testimonials",
      icon: <FaComments />,
      color: "#17a2b8",
      image: "https://media.istockphoto.com/id/1290521018/photo/sister-showing-something-on-smartphone-to-her-father-at-home.jpg?s=612x612&w=0&k=20&c=fJrSTxKxVLUI5KeQz9icMggho47NHbxa0mkm7fy2tuk=",
      path: "/customer-testimonials"
    },
    {
      title: "FAQ",
      icon: <FaQuestionCircle />,
      color: "#fd7e14",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      path: "/faq"
    },
    {
      title: "Our Blog",
      icon: <FaBlog />,
      color: "#e83e8c",
      image: "https://media.istockphoto.com/id/1251668084/photo/african-american-blogger-posting-online-via-laptop-on-sofa-at-home-collage.jpg?s=612x612&w=0&k=20&c=af8oIMxjcJtSxLJ24ojPK6CxSqU0psky-0nEpefBenM=",
      path: "/blog"
    },
    {
      title: "Careers",
      icon: <FaBriefcase />,
      color: "#20c997",
      image: "https://media.istockphoto.com/id/2184686650/photo/power-plant-worker-using-scada-system.jpg?s=612x612&w=0&k=20&c=1W22iM2J23wPdEvCWIDCsQ2gbFB5DmQ4eZbKkwAAwd0=",
      path: "/careers"
    }
  ];

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  return (
    <section className="hmc-mobile-quick-links">
      <div className="hmc-quick-links-header">
        <h2>QUICK LINKS</h2>
        <p className="hmc-section-intro">
          Navigate through our website to find the best products that suit your preferences.
          Subscribe to plans or customize according to your budget and needs.
        </p>
      </div>
      
      <div className="hmc-quick-links-grid">
        {linkItems.map((item, index) => (
          <Link key={index} to={item.path} className="hmc-quick-link-card">
            <div className="hmc-card-image-container">
              <img 
                src={item.image} 
                alt={item.title}
                loading="lazy"
                onError={handleImageError}
              />
              <div className="hmc-card-icon-fallback" style={{ background: item.color }}>
                {item.icon}
              </div>
              <div className="hmc-card-overlay" style={{ background: `${item.color}40` }}></div>
            </div>
            <div className="hmc-card-content">
              <div className="hmc-card-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h3 className="hmc-card-title">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;