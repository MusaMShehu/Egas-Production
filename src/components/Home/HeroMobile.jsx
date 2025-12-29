import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaFire, FaClock, FaTruck, FaPercent } from 'react-icons/fa';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "eGAS",
      subtitle: "ONLINE GAS SUPPLY",
      description: "Fast & reliable gas delivery to your doorstep. Order instantly or subscribe for routine delivery.",
      bgColor: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
      icon: <FaTruck />
    },
    {
      id: 2,
      title: "Up to 20% OFF",
      subtitle: "DISCOUNTS & SAVINGS",
      description: "Enjoy exclusive discounts on subscriptions and bulk orders. Save more with our premium plans.",
      bgColor: "linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)",
      icon: <FaPercent />
    },
    {
      id: 3,
      title: "24/7 Service",
      subtitle: "ALWAYS AVAILABLE",
      description: "Round-the-clock service available. Emergency deliveries and support whenever you need.",
      bgColor: "linear-gradient(135deg, #28a745 0%, #218838 100%)",
      icon: <FaClock />
    },
    {
      id: 4,
      title: "Flash Sale",
      subtitle: "LIMITED TIME OFFER",
      description: "Special discounts on refills this week only. Don't miss out on amazing deals!",
      bgColor: "linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)",
      icon: <FaFire />
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  return (
    <section className="mobile-hero">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className="carousel-slide"
              style={{ background: slide.bgColor }}
            >
              <div className="slide-content">
                <div className="slide-icon">
                  {slide.icon}
                </div>
                <h2 className="slide-title">{slide.title}</h2>
                <h3 className="slide-subtitle">{slide.subtitle}</h3>
                <p className="slide-description">{slide.description}</p>
                
                {/* Features for first slide only */}
                {index === 0 && (
                  <div className="hero-features">
                    <div className="feature">
                      <FaPercent />
                      <span>Discounts Up to 20%</span>
                    </div>
                    <div className="feature">
                      <FaClock />
                      <span>24/7 Service Available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button className="carousel-btn prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className="carousel-btn next" onClick={nextSlide}>
          <FaChevronRight />
        </button>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button className="autoplay-toggle" onClick={toggleAutoPlay}>
          {isAutoPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      {/* Hero Content Overlay */}
      <div className="hero-content-overlay">
        <div className="hero-main-content">
          <h1 className="hero-brand">eGAS</h1>
          <p className="hero-tagline">
            Fast & Reliable Gas Delivery!
          </p>
          <p className="hero-description">
            We deliver reliable, high-quality, and affordable gas to homes, businesses, and restaurants. 
            Order instantly or subscribe for routine doorstep delivery.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="hero-action-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = '/order'}>
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;