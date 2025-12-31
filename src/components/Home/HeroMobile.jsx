import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaFire, FaClock, FaTruck, FaPercent } from 'react-icons/fa';
import "./HeroMobile.css";

const slides = [
  {
    id: 1,
    title: "eGAS",
    subtitle: "ONLINE GAS SUPPLY",
    description: "Fast & reliable gas delivery to your doorstep. Order instantly or subscribe for routine delivery.",
    image: "https://media.istockphoto.com/id/1202533288/photo/lpg-cylinders-valve.jpg?s=612x612&w=0&k=20&c=iKeZiAYzAUxu4HFp4YpeD0e_wlzJjSj86NG_lxNZZf4=",
    // overlayColor: "rgba(0, 123, 255, 0.75)",
    // icon: <FaTruck />,
    // iconColor: "#007bff"
  },
  {
    id: 2,
    title: "Up to 20% OFF",
    subtitle: "DISCOUNTS & SAVINGS",
    description: "Enjoy exclusive discounts on subscriptions and bulk orders. Save more with our premium plans.",
    image: "https://media.istockphoto.com/id/679972946/photo/a-hose-connected-to-the-cylinder-red-gas-supply.jpg?s=612x612&w=0&k=20&c=Tj9si9HtItWsJzvdg-NknYNZt4RAARS6s_uoWai3j0o=",
    // overlayColor: "rgba(255, 107, 53, 0.75)",
    // icon: <FaPercent />,
    // iconColor: "#ff6b35"
  },
  {
    id: 3,
    title: "24/7 Service",
    subtitle: "ALWAYS AVAILABLE",
    description: "Round-the-clock service available. Emergency deliveries and support whenever you need.",
    image: "https://media.istockphoto.com/id/1484235236/photo/propane-gas-cylinder-with-hose-and-regulator-for-bbq-grill-grilling-safety-lpg-equipment.jpg?s=612x612&w=0&k=20&c=48zcBvCwpytvg7QK_i3SXYLcfpvubrbBlGi4p0kGUkI=",
    // overlayColor: "rgba(40, 167, 69, 0.75)",
    // icon: <FaClock />,
    // iconColor: "#28a745"
  },
  {
    id: 4,
    title: "Flash Sale",
    subtitle: "LIMITED TIME OFFER",
    description: "Special discounts on refills this week only. Don't miss out on amazing deals!",
    image: "https://media.istockphoto.com/id/2196362851/photo/used-gas-butane-cylinder-containers.jpg?s=612x612&w=0&k=20&c=4LRL7tdwykyOmvxSOXvMOw0M0B-9w71du4DOVZ_Cct0=",
    // overlayColor: "rgba(255, 68, 68, 0.75)",
    // icon: <FaFire />,
    // iconColor: "#ff4444"
  }
];

const SlideContent = ({ slide, isActive }) => (
  <div className={`hmc-slide-content ${isActive ? 'active' : ''}`}>
    <div className="hmc-slide-icon" style={{ color: slide.iconColor }}>
      {slide.icon}
    </div>
    <h2 className="hmc-slide-title">{slide.title}</h2>
    <h3 className="hmc-slide-subtitle">{slide.subtitle}</h3>
    <p className="hmc-slide-description">{slide.description}</p>
  </div>
);

const Slide = ({ slide, isActive }) => (
  <div 
    className="hmc-carousel-slide"
    style={{ 
      backgroundImage: `url('${slide.image}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  >
    <div 
      className="hmc-slide-overlay"
      style={{ backgroundColor: slide.overlayColor }}
    />
    <SlideContent slide={slide} isActive={isActive} />
  </div>
);

const CarouselControls = ({ onPrev, onNext }) => (
  <>
    <button className="hmc-carousel-btn hmc-prev" onClick={onPrev} aria-label="Previous slide">
      <FaChevronLeft />
    </button>
    <button className="hmc-carousel-btn hmc-next" onClick={onNext} aria-label="Next slide">
      <FaChevronRight />
    </button>
  </>
);

const CarouselIndicators = ({ slides, currentSlide, onGoToSlide }) => (
  <div className="hmc-carousel-indicators">
    {slides.map((_, index) => (
      <button
        key={index}
        className={`hmc-indicator ${index === currentSlide ? 'hmc-active' : ''}`}
        onClick={() => onGoToSlide(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
);

const AutoPlayToggle = ({ isAutoPlaying, onToggle }) => (
  <button 
    className="hmc-autoplay-toggle" 
    onClick={onToggle}
    aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
  >
    {isAutoPlaying ? <FaPause /> : <FaPlay />}
  </button>
);

const HeroFeatures = () => (
  <div className="hmc-hero-features">
    {/* <div className="hmc-feature">
      <FaPercent style={{ color: '#ff6b35' }} />
      <span>Discounts Up to 20%</span>
    </div> */}
    {/* <div className="hmc-feature">
      <FaClock style={{ color: '#28a745' }} />
      <span>24/7 Service Available</span>
    </div> */}
  </div>
);

const HeroContent = () => {
  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handleOrderNow = () => {
    window.location.href = '/subscription-plan';
  };

  return (
    <div className="hmc-hero-content-overlay">
      <div className="hmc-hero-main-content">
        <h1 className="hmc-hero-brand">e-GAS</h1>
        <p className="hmc-hero-tagline">
          Fast & Reliable Gas Delivery!
        </p>
        <p className="hmc-hero-description">
          We deliver reliable, high-quality, and affordable gas to homes, businesses, and restaurants. 
          Order instantly or subscribe for routine doorstep delivery.
        </p>
        
        <HeroFeatures />
        
        <div className="hmc-hero-action-buttons">
          <button className="hmc-btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
          {/* <button className="hmc-btn-secondary" onClick={handleOrderNow}>
            Order Now
          </button> */}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="hmc-mobile-hero">
      {/* Hero Carousel */}
      <div className="hmc-hero-carousel">
        <div 
          className="hmc-carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="hmc-slide-wrapper">
              <Slide slide={slide} isActive={index === currentSlide} />
            </div>
          ))}
        </div>

        <CarouselControls onPrev={prevSlide} onNext={nextSlide} />
        <CarouselIndicators 
          slides={slides} 
          currentSlide={currentSlide} 
          onGoToSlide={goToSlide} 
        />
        <AutoPlayToggle 
          isAutoPlaying={isAutoPlaying} 
          onToggle={toggleAutoPlay} 
        />
      </div>

      <HeroContent />
    </section>
  );
};

export default Hero;