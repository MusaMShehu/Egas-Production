import React, { useState } from 'react';
import { 
  FaCalendar, 
  FaUser, 
  FaSearch, 
  FaChevronLeft, 
  FaChevronRight,
  FaTag,
  FaFolder,
  FaClock,
  FaShare,
  FaHeart,
  FaComment,
  FaArrowRight,
  FaHome,
  FaEnvelope
} from 'react-icons/fa';
import './Blog.css';
import './Bloog.css';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Gas Safety Tips Every Homeowner Should Know",
      excerpt: "Learn the crucial safety measures to prevent accidents and ensure safe usage of gas in your home. Our experts share professional advice...",
      content: `
        <h2>Understanding Gas Safety in Your Home</h2>
        <p>Gas safety is paramount for every homeowner. Proper handling and maintenance can prevent accidents and ensure a safe living environment. Here are the 10 essential tips:</p>
        
        <h3>1. Regular Appliance Maintenance</h3>
        <p>Schedule annual inspections for all gas appliances by qualified technicians. Regular maintenance ensures optimal performance and early detection of potential issues.</p>
        
        <h3>2. Proper Ventilation</h3>
        <p>Always ensure adequate ventilation when using gas appliances. Never block air vents and keep rooms well-ventilated to prevent carbon monoxide buildup.</p>
        
        <h3>3. Install Carbon Monoxide Detectors</h3>
        <p>Place CO detectors near sleeping areas and on every level of your home. Test them monthly and replace batteries annually.</p>
        
        <h3>4. Know the Signs of Gas Leaks</h3>
        <p>Recognize the distinctive sulfur-like odor added to natural gas. Other signs include hissing sounds, dead vegetation near gas lines, and unexplained physical symptoms.</p>
        
        <h3>5. Emergency Procedures</h3>
        <p>Know what to do in case of a gas leak: evacuate immediately, don't operate electrical switches, and call emergency services from a safe distance.</p>
        
        <h3>6. Proper Storage</h3>
        <p>Store gas cylinders upright in well-ventilated areas, away from heat sources and direct sunlight.</p>
        
        <h3>7. Use Certified Appliances</h3>
        <p>Only use gas appliances that carry safety certifications and are installed by licensed professionals.</p>
        
        <h3>8. Regular Hose Inspections</h3>
        <p>Check gas hoses regularly for cracks, wear, or damage. Replace them every 5 years or when showing signs of deterioration.</p>
        
        <h3>9. Keep Flammable Materials Away</h3>
        <p>Maintain a safe distance between gas appliances and flammable materials like curtains, paper, and cleaning supplies.</p>
        
        <h3>10. Educate Family Members</h3>
        <p>Ensure all household members understand basic gas safety rules and emergency procedures.</p>
      `,
      image: "https://media.istockphoto.com/id/2015197442/photo/gas-bottle-passed-safety-inspection-bright-background-with-safe-sticker-and-documents.jpg?s=612x612&w=0&k=20&c=CFnl2YD3jwRuVRPPcziYFnesYsFDDu4KnJBzsYZCjOU=",
      date: "June 15, 2023",
      author: "Safety Expert",
      readTime: "8 min read",
      tags: ["Safety", "Tips", "Home", "Maintenance"],
      category: "Safety Tips",
      featured: true,
      likes: 42,
      comments: 15
    },
    {
      id: 2,
      title: "Why Professional Chefs Prefer Cooking with Gas",
      excerpt: "Discover the reasons why gas cooking is preferred by culinary experts worldwide and how it can transform your home cooking experience...",
      content: `
        <h2>The Chef's Choice: Gas Cooking</h2>
        <p>Professional chefs overwhelmingly prefer gas cooktops for several compelling reasons that affect both cooking quality and kitchen efficiency.</p>
        
        <h3>Instant Heat Control</h3>
        <p>Gas burners provide immediate response when adjusting temperature. This instant control allows chefs to make precise adjustments crucial for delicate sauces and perfect searing.</p>
        
        <h3>Even Heat Distribution</h3>
        <p>Gas flames wrap around cookware, providing uniform heating that eliminates hot spots and ensures consistent cooking results.</p>
        
        <h3>Visual Flame Indicator</h3>
        <p>The visible flame gives immediate feedback about heat intensity, allowing for intuitive temperature management without guessing.</p>
        
        <h3>Better for Specific Techniques</h3>
        <p>Gas excels at techniques like wok cooking, flambéing, and charring that require direct flame contact and rapid heat changes.</p>
        
        <h3>Cost-Effective Operation</h3>
        <p>Gas typically costs less than electricity for cooking, making it more economical for high-volume professional kitchens.</p>
        
        <h3>Reliability During Power Outages</h3>
        <p>Gas cooktops continue working during electrical outages, ensuring uninterrupted kitchen operations.</p>
      `,
      image: "https://media.istockphoto.com/id/2200065927/photo/professional-chef-cooking-and-stirring-food-in-a-pan-in-a-commercial-kitchen.jpg?s=612x612&w=0&k=20&c=q8g5mHu0t2sc7GyREroEQ35fswKGaDsCQ6gYCWIWjWk=",
      date: "June 8, 2023",
      author: "Chef Adeola",
      readTime: "6 min read",
      tags: ["Cooking", "Tips", "Professional", "Kitchen"],
      category: "Cooking Guides",
      featured: true,
      likes: 38,
      comments: 12
    },
    {
      id: 3,
      title: "How to Make Your Kitchen More Energy Efficient",
      excerpt: "Simple changes to your cooking habits and kitchen setup can significantly reduce your energy consumption and utility bills. Learn how...",
      content: `
        <h2>Energy Efficiency in the Kitchen</h2>
        <p>Transforming your kitchen into an energy-efficient space not only saves money but also reduces your environmental footprint.</p>
        
        <h3>Smart Appliance Usage</h3>
        <p>Use the right-sized burners for your cookware. A small pan on a large burner wastes up to 40% of the heat generated.</p>
        
        <h3>Proper Cookware Selection</h3>
        <p>Choose heavy-bottomed pans with flat bases that make full contact with the burner surface for maximum heat transfer.</p>
        
        <h3>Lid Usage Matters</h3>
        <p>Always use lids when cooking. This simple practice can reduce cooking time and energy use by up to 60%.</p>
        
        <h3>Regular Maintenance</h3>
        <p>Clean burners and reflectors regularly. Dirty burners can reduce efficiency by up to 15%.</p>
        
        <h3>Pressure Cooking Benefits</h3>
        <p>Use pressure cookers for appropriate dishes. They can reduce cooking time and energy use by 50-70%.</p>
        
        <h3>Batch Cooking Strategy</h3>
        <p>Cook multiple items at once when possible. An already-hot oven or burner uses less energy than starting from cold.</p>
      `,
      image: "https://media.istockphoto.com/id/2198014033/photo/a-traditional-dutch-clean-domestic-kitchen.jpg?s=612x612&w=0&k=20&c=Ei_lqsW1K9n7WonGU1nr1Yg3mjl8YlY_XjAlt7ETw_4=",
      date: "May 30, 2023",
      author: "Energy Expert",
      readTime: "7 min read",
      tags: ["Energy", "Efficiency", "Savings", "Kitchen"],
      category: "Energy Efficiency",
      likes: 29,
      comments: 8
    },
    {
      id: 4,
      title: "The Ultimate Guide to Gas Appliance Maintenance",
      excerpt: "Regular maintenance extends the life of your gas appliances and ensures safe operation. Our comprehensive guide shows you what to do...",
      content: `
        <h2>Comprehensive Gas Appliance Care</h2>
        <p>Proper maintenance of gas appliances is crucial for safety, efficiency, and longevity. Follow this ultimate maintenance guide.</p>
        
        <h3>Monthly Maintenance Tasks</h3>
        <p>• Visual inspection of burners and flames<br/>
        • Check for unusual odors or sounds<br/>
        • Clean surface spills and debris</p>
        
        <h3>Quarterly Deep Cleaning</h3>
        <p>• Remove and clean burner caps and grates<br/>
        • Clean ignition systems<br/>
        • Check gas connections for tightness</p>
        
        <h3>Annual Professional Service</h3>
        <p>Schedule professional inspections that include:<br/>
        • Combustion analysis<br/>
        • Gas pressure checks<br/>
        • Safety device testing<br/>
        • Ventilation system inspection</p>
        
        <h3>Signs You Need Immediate Attention</h3>
        <p>• Yellow or orange flames (should be blue)<br/>
        • Soot buildup around appliances<br/>
        • Unusual noises during operation<br/>
        • Pilot lights that frequently go out</p>
      `,
      image: "https://media.istockphoto.com/id/1093111438/photo/regulator-for-propane-butane-gas-cylinder-and-accessories-on-a-wooden-workshop-table-gas.jpg?s=612x612&w=0&k=20&c=ZVBEOsj2A6_HH0XfrYqkg6gjgkvADP1bgxI0qMNlCkc=",
      date: "May 22, 2023",
      author: "Technical Team",
      readTime: "10 min read",
      tags: ["Maintenance", "Guide", "Appliances", "Safety"],
      category: "Maintenance",
      likes: 35,
      comments: 11
    },
    {
      id: 5,
      title: "How e-GAS Supports Restaurant Businesses",
      excerpt: "Discover how our specialized business solutions help restaurants maintain uninterrupted service and manage their gas needs efficiently...",
      content: `
        <h2>e-GAS: Your Restaurant's Reliable Partner</h2>
        <p>Restaurants depend on consistent gas supply for their operations. e-GAS provides tailored solutions for the food service industry.</p>
        
        <h3>24/7 Emergency Delivery</h3>
        <p>Never run out of gas during service hours. Our emergency delivery service ensures you're always stocked.</p>
        
        <h3>Bulk Pricing Options</h3>
        <p>Special rates for high-volume users help restaurants manage their operational costs effectively.</p>
        
        <h3>Regular Maintenance Contracts</h3>
        <p>Scheduled maintenance plans keep your equipment running efficiently and safely.</p>
        
        <h3>Kitchen Efficiency Audits</h3>
        <p>Our experts analyze your gas usage patterns and recommend efficiency improvements.</p>
        
        <h3>Training for Kitchen Staff</h3>
        <p>Comprehensive training on safe gas handling and efficient cooking practices.</p>
      `,
      image: "https://media.istockphoto.com/id/1063806806/photo/portugal.jpg?s=612x612&w=0&k=20&c=lLIDczr31Dvo0xTjaBSvm7eB-jOq5D2ALa9M1lPjm40=",
      date: "May 15, 2023",
      author: "Business Team",
      readTime: "5 min read",
      tags: ["Business", "Restaurant", "Solutions", "Commercial"],
      category: "Business Solutions",
      likes: 27,
      comments: 6
    },
    {
      id: 6,
      title: "The Role of LPG in Sustainable Energy Solutions",
      excerpt: "Learn how liquefied petroleum gas (LPG) serves as a cleaner alternative to traditional fuels and contributes to environmental sustainability...",
      content: `
        <h2>LPG: A Bridge to Sustainable Energy</h2>
        <p>Liquefied Petroleum Gas plays a crucial role in the transition to cleaner energy sources while maintaining reliability and affordability.</p>
        
        <h3>Lower Carbon Emissions</h3>
        <p>LPG produces up to 20% less CO2 than oil and 50% less than coal, making it a cleaner fossil fuel alternative.</p>
        
        <h3>Reduced Particulate Matter</h3>
        <p>Unlike wood or coal, LPG burns cleanly with minimal particulate emissions, improving air quality.</p>
        
        <h3>Energy Efficiency</h3>
        <p>LPG has a high energy content and efficient combustion, meaning less fuel is needed to produce the same amount of energy.</p>
        
        <h3>Renewable Integration</h3>
        <p>LPG can complement intermittent renewable sources by providing reliable backup power.</p>
        
        <h3>Transition Fuel</h3>
        <p>As we move toward fully renewable energy systems, LPG serves as an important transition fuel that's cleaner than alternatives.</p>
      `,
      image: "https://media.istockphoto.com/id/477395027/photo/eco-gas-tank-concept.jpg?s=612x612&w=0&k=20&c=7bb7Eg8boTwswSPRy7aPDwgW7A2IsHu9Ygg6N2dCA0c=",
      date: "May 5, 2023",
      author: "Environmental Team",
      readTime: "6 min read",
      tags: ["Sustainability", "Environment", "LPG", "Energy"],
      category: "Industry News",
      likes: 31,
      comments: 9
    }
  ];

  const categories = [
    { name: "All", count: blogPosts.length },
    { name: "Safety Tips", count: 12 },
    { name: "Cooking Guides", count: 8 },
    { name: "Maintenance", count: 5 },
    { name: "Business Solutions", count: 7 },
    { name: "Energy Efficiency", count: 6 },
    { name: "Industry News", count: 9 }
  ];

  const tags = ["Safety", "Cooking", "Maintenance", "Efficiency", "Business", "Tips", "Guide", "LPG", "Energy", "Sustainability", "Home", "Professional", "Kitchen", "Commercial", "Environment"];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-page">
      
      {/* Page Header */}
      <section className="blog-page-header">
        <div className="blog-header-content">
          <h1>e-GAS Blog</h1>
          <p>Stay updated with the latest news, tips, and insights about gas safety, cooking, and home management.</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="blog-breadcrumb">
        <a href="/"><FaHome className="blog-breadcrumb-icon" /> Home</a>
        <span className="blog-breadcrumb-separator"><FaArrowRight /></span>
        <a href="/quick-links">Quick Links</a>
        <span className="blog-breadcrumb-separator"><FaArrowRight /></span>
        <span className="blog-current-page">Blog</span>
      </nav>

      {/* Main Content */}
      <div className="blog-container">
        <div className="blog-main-content">
          
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="blog-featured-section">
              <h2 className="blog-section-title">Featured Articles</h2>
              <div className="blog-featured-grid">
                {featuredPosts.map(post => (
                  <article key={post.id} className="blog-featured-card">
                    <div className="blog-featured-image">
                      <img src={post.image} alt={post.title} />
                      <div className="blog-featured-badge">Featured</div>
                    </div>
                    <div className="blog-featured-content">
                      <div className="blog-meta">
                        <span><FaCalendar className="blog-meta-icon" /> {post.date}</span>
                        <span><FaUser className="blog-meta-icon" /> {post.author}</span>
                        <span><FaClock className="blog-meta-icon" /> {post.readTime}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <div className="blog-tags">
                        {post.tags.map(tag => (
                          <span key={tag} className="blog-tag"><FaTag className="blog-tag-icon" /> {tag}</span>
                        ))}
                      </div>
                      <div className="blog-actions">
                        <button className="blog-like-btn">
                          <FaHeart /> {post.likes}
                        </button>
                        <button className="blog-comment-btn">
                          <FaComment /> {post.comments}
                        </button>
                        <button className="blog-share-btn">
                          <FaShare />
                        </button>
                      </div>
                      <a href={`/blog/${post.id}`} className="blog-read-more">
                        Read Full Article <FaArrowRight className="blog-read-more-icon" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Category Filter */}
          <div className="blog-category-filter">
            {categories.map(category => (
              <button
                key={category.name}
                className={`blog-category-btn ${activeCategory === category.name ? 'blog-category-active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.name);
                  setCurrentPage(1);
                }}
              >
                {category.name} <span className="blog-category-count">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <section className="blog-posts-section">
            <h2 className="blog-section-title">
              {activeCategory === 'All' ? 'Latest Articles' : activeCategory}
            </h2>
            <div className="blog-posts-grid">
              {currentPosts.map(post => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image">
                    <img src={post.image} alt={post.title} />
                    <div className="blog-card-category">{post.category}</div>
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span><FaCalendar className="blog-meta-icon" /> {post.date}</span>
                      <span><FaUser className="blog-meta-icon" /> {post.author}</span>
                      <span><FaClock className="blog-meta-icon" /> {post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-tags">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="blog-card-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="blog-card-actions">
                      <a href={`/blog/${post.id}`} className="blog-card-read-more">
                        Read More <FaArrowRight className="blog-read-more-icon" />
                      </a>
                      <div className="blog-card-stats">
                        <span><FaHeart /> {post.likes}</span>
                        <span><FaComment /> {post.comments}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="blog-pagination">
                <button 
                  className="blog-pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft /> Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`blog-pagination-btn ${currentPage === page ? 'blog-pagination-active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="blog-pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* Search Widget */}
          <div className="blog-sidebar-widget">
            <h3 className="blog-widget-title">Search Articles</h3>
            <form className="blog-search-form" onSubmit={handleSearch}>
              <div className="blog-search-input-group">
                <FaSearch className="blog-search-icon" />
                <input 
                  type="text" 
                  className="blog-search-input" 
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="blog-search-btn">Search</button>
            </form>
          </div>

          {/* Categories Widget */}
          <div className="blog-sidebar-widget">
            <h3 className="blog-widget-title">Categories</h3>
            <ul className="blog-categories-list">
              {categories.slice(1).map(category => (
                <li key={category.name} className="blog-category-item">
                  <button 
                    className={`blog-category-link ${activeCategory === category.name ? 'blog-category-link-active' : ''}`}
                    onClick={() => {
                      setActiveCategory(category.name);
                      setCurrentPage(1);
                    }}
                  >
                    <FaFolder className="blog-category-icon" />
                    {category.name}
                    <span className="blog-category-post-count">{category.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts Widget */}
          <div className="blog-sidebar-widget">
            <h3 className="blog-widget-title">Recent Posts</h3>
            <ul className="blog-recent-posts">
              {recentPosts.map(post => (
                <li key={post.id} className="blog-recent-post">
                  <div className="blog-recent-post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="blog-recent-post-content">
                    <h4>
                      <a href={`/blog/${post.id}`} className="blog-recent-post-title">
                        {post.title}
                      </a>
                    </h4>
                    <div className="blog-recent-post-meta">
                      <FaCalendar className="blog-meta-icon" /> {post.date}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags Widget */}
          <div className="blog-sidebar-widget">
            <h3 className="blog-widget-title">Popular Tags</h3>
            <div className="blog-tags-cloud">
              {tags.map(tag => (
                <a key={tag} href={`/blog/tag/${tag}`} className="blog-tag-link">
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Widget */}
          <div className="blog-sidebar-widget blog-newsletter-widget">
            <h3 className="blog-widget-title">Stay Updated</h3>
            <p className="blog-newsletter-desc">
              Subscribe to our newsletter for the latest tips and updates.
            </p>
            <form className="blog-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="blog-newsletter-input-group">
                <FaEnvelope className="blog-newsletter-icon" />
                <input 
                  type="email" 
                  className="blog-newsletter-input" 
                  placeholder="Your email address" 
                  required 
                />
              </div>
              <button type="submit" className="blog-newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Newsletter Section */}
      <section className="blog-newsletter-section">
        <div className="blog-newsletter-container">
          <div className="blog-newsletter-content">
            <h2>Never Miss an Update</h2>
            <p>Subscribe to our newsletter and get the latest articles, tips, and special offers delivered straight to your inbox.</p>
            <form className="blog-newsletter-main-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                className="blog-newsletter-main-input" 
                placeholder="Enter your email address" 
                required 
              />
              <button type="submit" className="blog-newsletter-main-btn">
                Subscribe Now
              </button>
            </form>
            <p className="blog-newsletter-note">No spam, unsubscribe at any time</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="blog-cta-section">
        <div className="blog-cta-container">
          <div className="blog-cta-content">
            <h2>Ready to Experience Better Gas Service?</h2>
            <p>Join thousands of satisfied customers who enjoy reliable gas delivery and exceptional service.</p>
            <div className="blog-cta-buttons">
              <a href="/register" className="blog-cta-button blog-cta-primary">Sign Up Now</a>
              <a href="/contact" className="blog-cta-button blog-cta-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;