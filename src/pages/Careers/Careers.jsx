import React, { useState } from 'react';
import './Careers.css'; // We'll extract the CSS to a separate file

const Careers = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    message: ''
  });

  // const toggleMenu = () => {
  //   setMenuOpen(!menuOpen);
  // };

  const toggleJob = (jobId) => {
    if (activeJob === jobId) {
      setActiveJob(null);
    } else {
      setActiveJob(jobId);
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const openApplicationModal = (jobTitle) => {
    setSelectedJob(jobTitle);
    setModalOpen(true);
  };

  const closeApplicationModal = () => {
    setModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      resume: null,
      message: ''
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your application! We will review your submission and contact you soon.');
    closeApplicationModal();
  };

  // Job data
  const jobs = [
    // {
    //   id: 1,
    //   title: "Logistics Coordinator",
    //   category: "operations",
    //   location: "Lagos",
    //   type: "Full-time",
    //   posted: "2 days ago",
    //   description: "We're looking for a Logistics Coordinator to optimize our delivery routes, manage driver schedules, and ensure efficient operations across our service areas.",
    //   requirements: [
    //     "Bachelor's degree in Logistics, Supply Chain, or related field",
    //     "3+ years experience in logistics or operations coordination",
    //     "Strong analytical and problem-solving skills",
    //     "Proficiency with logistics software and GPS systems",
    //     "Excellent communication and organizational skills"
    //   ],
    //   responsibilities: [
    //     "Plan and optimize daily delivery routes",
    //     "Coordinate with drivers and field teams",
    //     "Monitor delivery performance and efficiency",
    //     "Handle logistics challenges and resolve issues",
    //     "Maintain accurate records and reports"
    //   ]
    // },
    // {
    //   id: 2,
    //   title: "Frontend Developer",
    //   category: "technology",
    //   location: "Remote",
    //   type: "Full-time",
    //   posted: "5 days ago",
    //   description: "Join our tech team to build and maintain customer-facing applications that make gas delivery seamless and intuitive for our users.",
    //   requirements: [
    //     "3+ years experience in frontend development",
    //     "Proficiency in HTML, CSS, JavaScript, and React",
    //     "Experience with responsive design and cross-browser compatibility",
    //     "Familiarity with RESTful APIs and modern frontend tools",
    //     "Strong UI/UX sensibilities"
    //   ],
    //   responsibilities: [
    //     "Develop and maintain customer-facing web applications",
    //     "Collaborate with UX designers and backend developers",
    //     "Implement responsive designs for mobile and desktop",
    //     "Write clean, maintainable, and efficient code",
    //     "Participate in code reviews and team meetings"
    //   ]
    // },
    // {
    //   id: 3,
    //   title: "Customer Success Manager",
    //   category: "customer-service",
    //   location: "Abuja",
    //   type: "Full-time",
    //   posted: "1 week ago",
    //   description: "We're seeking a Customer Success Manager to build strong relationships with our clients, ensure their satisfaction, and help them get the most value from our services.",
    //   requirements: [
    //     "Bachelor's degree in Business, Communications, or related field",
    //     "2+ years experience in customer success or account management",
    //     "Excellent communication and interpersonal skills",
    //     "Problem-solving attitude with customer-centric approach",
    //     "Experience with CRM software"
    //   ],
    //   responsibilities: [
    //     "Build and maintain strong client relationships",
    //     "Address customer inquiries and resolve issues",
    //     "Onboard new customers and educate them on our services",
    //     "Gather customer feedback and share with internal teams",
    //     "Identify opportunities for account growth"
    //   ]
    // },
    // {
    //   id: 4,
    //   title: "Business Development Executive",
    //   category: "business",
    //   location: "Port Harcourt",
    //   type: "Full-time",
    //   posted: "3 days ago",
    //   description: "Join our growth team to identify new business opportunities, build partnerships, and expand our market presence in the region.",
    //   requirements: [
    //     "Bachelor's degree in Business, Marketing, or related field",
    //     "3+ years experience in business development or sales",
    //     "Proven track record of meeting or exceeding targets",
    //     "Strong negotiation and presentation skills",
    //     "Knowledge of the local market and energy sector"
    //   ],
    //   responsibilities: [
    //     "Identify and pursue new business opportunities",
    //     "Build and maintain relationships with potential clients",
    //     "Develop and implement growth strategies",
    //     "Prepare and deliver business proposals",
    //     "Collaborate with marketing and operations teams"
    //   ]
    // }
  ];

  // Filter jobs based on active filter
  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.category === activeFilter);

  return (
    <div className="careers-page">
      
      {/* Page Header */}
      <section className="page-header">
        <h2>Careers at e-GAS</h2>
        <p>Join our team and be part of revolutionizing gas delivery services across Nigeria.</p>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <a href="/quick-links">Quick Links</a>
        Careers
      </div>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">Join Our Team</h2>
        
        <p className="intro-text">At e-GAS, we're building the future of gas delivery in Nigeria. We're looking for passionate, talented individuals who want to make a difference in people's lives while growing their careers in a dynamic, supportive environment.</p>
        
        {/* Benefits Section */}
        <div className="benefits-section">
          <h2 className="section-title">Why Work With Us</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3>Competitive Compensation</h3>
              <p>We offer attractive salary packages, performance bonuses, and comprehensive benefits.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Professional Growth</h3>
              <p>Continuous learning opportunities, training programs, and clear career progression paths.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Great Culture</h3>
              <p>Collaborative, inclusive environment that values diversity and work-life balance.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Modern Tools</h3>
              <p>Access to the latest technology and tools to help you do your best work.</p>
            </div>
          </div>
        </div>
        
        {/* Job Listings */}
        <h2 className="section-title">Current Openings</h2>
        <p className="recruitment-notice">There is no open position currently, you will be notified if the portal is open for recruitment,  stay tuned for our next recruitment</p>
        
        <div className="job-filters">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('all')}
          >
            All Positions
          </button>
          <button 
            className={`filter-button ${activeFilter === 'operations' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('operations')}
          >
            Operations
          </button>
          <button 
            className={`filter-button ${activeFilter === 'technology' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('technology')}
          >
            Technology
          </button>
          <button 
            className={`filter-button ${activeFilter === 'business' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('business')}
          >
            Business
          </button>
          <button 
            className={`filter-button ${activeFilter === 'customer-service' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('customer-service')}
          >
            Customer Service
          </button>
        </div>
        
        <div className="jobs-container">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className={`job-listing ${activeJob === job.id ? 'job-active' : ''}`} 
              data-category={job.category}
            >
              <div className="job-header" onClick={() => toggleJob(job.id)}>
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta">
                    <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                    <span><i className="fas fa-briefcase"></i> {job.type}</span>
                    <span><i className="fas fa-clock"></i> Posted {job.posted}</span>
                  </div>
                </div>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="job-details">
                <div className="job-description">
                  <p>{job.description}</p>
                </div>
                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="job-responsibilities">
                  <h4>Responsibilities:</h4>
                  <ul>
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
                <button className="job-apply" onClick={() => openApplicationModal(job.title)}>
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Culture Section */}
        <div className="culture-section">
          <h2 className="section-title">Our Culture</h2>
          
          <div className="culture-grid">
            <div className="culture-card">
              <div className="culture-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>Innovation</h3>
              <p>We encourage creative thinking and are always looking for better ways to serve our customers.</p>
            </div>
            
            <div className="culture-card">
              <div className="culture-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3>Collaboration</h3>
              <p>We believe in the power of teamwork and open communication across all levels.</p>
            </div>
            
            <div className="culture-card">
              <div className="culture-icon">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3>Integrity</h3>
              <p>We do what's right, not what's easy, and always keep our promises to customers and team members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Join Our Team?</h2>
        <p>If you don't see a position that matches your skills, send us your resume anyway! We're always looking for talented people.</p>
        <a href="/contact" className="cta-button">Submit General Application</a>
      </section>

      {/* Application Modal */}
      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`}>
        <div className="application-modal">
          <button className="close-modal" onClick={closeApplicationModal}>&times;</button>
          <h3>Apply for: <span id="modalJobTitle">{selectedJob}</span></h3>
          
          <form id="applicationForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="form-control" 
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
                className="form-control" 
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
                className="form-control" 
                value={formData.phone}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="resumeFile">Upload Resume</label>
              <div className="file-upload" onClick={() => document.getElementById('resumeFile').click()}>
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Click to upload your resume (PDF, DOC, DOCX)</p>
                <input 
                  type="file" 
                  id="resumeFile" 
                  accept=".pdf,.doc,.docx" 
                  style={{display: 'none'}}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Cover Letter</label>
              <textarea 
                id="message" 
                className="form-control" 
                rows="5" 
                placeholder="Why are you interested in this position?"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <button type="submit" className="submit-application">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers;