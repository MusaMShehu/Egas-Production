// src/components/Contact/Contact.js
import React, { useState } from 'react';
// import Header from '../Header';
// import Footer from '../Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Address",
      details: ["123 Gas Street, Energy City, Lagos, Nigeria"]
    },
    {
      icon: "fas fa-phone-alt",
      title: "Phone",
      details: ["+234 123 456 7890", "+234 987 654 3210"]
    },
    {
      icon: "fas fa-envelope",
      title: "Email",
      details: ["info@egas.com", "support@egas.com"]
    },
    {
      icon: "fas fa-clock",
      title: "Working Hours",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 4:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  return (
    <div className="contact-page">
      {/* <Header /> */}
      
      {/* Contact Hero Section */}
      <section className="page-hero">
        <h2>Contact Us</h2>
        <p>We're here to help with all your gas supply needs</p>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Have questions about our products or services? Our team is ready to help you with any inquiries.</p>
            
            {contactInfo.map((info, index) => (
              <div key={index} className="info-item">
                <i className={info.icon}></i>
                <div>
                  <h4>{info.title}</h4>
                  {info.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="contact-form">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleInputChange}
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Inquiry</option>
                  <option value="delivery">Delivery Question</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleInputChange}
                  required 
                ></textarea>
              </div>
              
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h3>Our Location</h3>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.622242833972!2d3.379295415231633!3d6.452622295336312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng" 
            width="100%" 
            height="450" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy"
            title="e-GAS Location Map"
          ></iframe>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Contact;