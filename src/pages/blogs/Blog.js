// src/components/Blog/Blog.js
import React, { useState } from 'react';
import './Blog.css';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Gas Safety Tips Every Homeowner Should Know",
      excerpt: "Learn the crucial safety measures to prevent accidents and ensure safe usage of gas in your home. Our experts share professional advice...",
      image: "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      date: "June 15, 2023",
      author: "Admin",
      tags: ["Safety", "Tips"],
      category: "Safety Tips"
    },
    {
      id: 2,
      title: "Why Professional Chefs Prefer Cooking with Gas",
      excerpt: "Discover the reasons why gas cooking is preferred by culinary experts worldwide and how it can transform your home cooking experience...",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      date: "June 8, 2023",
      author: "Chef Adeola",
      tags: ["Cooking", "Tips"],
      category: "Cooking Guides"
    },
    {
      id: 3,
      title: "How to Make Your Kitchen More Energy Efficient",
      excerpt: "Simple changes to your cooking habits and kitchen setup can significantly reduce your energy consumption and utility bills. Learn how...",
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      date: "May 30, 2023",
      author: "Energy Expert",
      tags: ["Energy", "Efficiency"],
      category: "Energy Efficiency"
    },
    {
      id: 4,
      title: "The Ultimate Guide to Gas Appliance Maintenance",
      excerpt: "Regular maintenance extends the life of your gas appliances and ensures safe operation. Our comprehensive guide shows you what to do...",
      image: "https://images.unsplash.com/photo-1585149553637-5a1d4a8a7c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      date: "May 22, 2023",
      author: "Technical Team",
      tags: ["Maintenance", "Guide"],
      category: "Maintenance"
    },
    {
      id: 5,
      title: "How e-GAS Supports Restaurant Businesses",
      excerpt: "Discover how our specialized business solutions help restaurants maintain uninterrupted service and manage their gas needs efficiently...",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      date: "May 15, 2023",
      author: "Business Team",
      tags: ["Business", "Restaurant"],
      category: "Business Solutions"
    },
    {
      id: 6,
      title: "The Role of LPG in Sustainable Energy Solutions",
      excerpt: "Learn how liquefied petroleum gas (LPG) serves as a cleaner alternative to traditional fuels and contributes to environmental sustainability...",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      date: "May 5, 2023",
      author: "Environmental Team",
      tags: ["Sustainability", "Environment"],
      category: "Industry News"
    }
  ];

  const categories = [
    { name: "Safety Tips", count: 12 },
    { name: "Cooking Guides", count: 8 },
    { name: "Maintenance", count: 5 },
    { name: "Business Solutions", count: 7 },
    { name: "Energy Efficiency", count: 6 },
    { name: "Industry News", count: 9 }
  ];

  const recentPosts = blogPosts.slice(0, 3);

  const tags = ["Safety", "Cooking", "Maintenance", "Efficiency", "Business", "Tips", "Guide", "LPG", "Energy", "Sustainability"];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <div className="blog-page">
      
      {/* Page Header */}
      <section className="page-header">
        <h2>e-GAS Blog</h2>
        <p>Stay updated with the latest news, tips, and insights about gas safety, cooking, and home management.</p>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a> 
        <a href="/quick-links">Quick Links</a> 
        Blog
      </div>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">Latest Articles</h2>

        {/* Blog Posts */}
        <div className="blog-posts">
          {blogPosts.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span><i className="far fa-calendar"></i> {post.date}</span>
                  <span><i className="far fa-user"></i> {post.author}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
                <a href="#" className="read-more">Read More</a>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-widget">
            <h3>Search</h3>
            <form className="search-form" onSubmit={handleSearch}>
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="sidebar-widget">
            <h3>Categories</h3>
            <ul className="categories-list">
              {categories.map(category => (
                <li key={category.name}>
                  <a href="#">
                    {category.name} <span className="category-count">{category.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3>Recent Posts</h3>
            <ul className="recent-posts">
              {recentPosts.map(post => (
                <li key={post.id} className="recent-post">
                  <div className="recent-post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="recent-post-content">
                    <h4><a href="#">{post.title}</a></h4>
                    <div className="recent-post-date">{post.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3>Tags</h3>
            <div className="tags-cloud">
              {tags.map(tag => (
                <a key={tag} href="#" className="tag-link">{tag}</a>
              ))}
            </div>
          </div>
        </aside>

        {/* Pagination */}
        <div className="pagination">
          <a href="#" className="pagination-button"><i className="fas fa-chevron-left"></i></a>
          <a href="#" className="pagination-button active">1</a>
          <a href="#" className="pagination-button">2</a>
          <a href="#" className="pagination-button">3</a>
          <a href="#" className="pagination-button">4</a>
          <a href="#" className="pagination-button"><i className="fas fa-chevron-right"></i></a>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with the latest tips, news, and promotions from e-GAS. No spam, just valuable content.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input type="email" className="newsletter-input" placeholder="Your email address" required />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>
        </div>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Experience the e-GAS Difference</h2>
          <p>Join thousands of satisfied customers who enjoy reliable gas delivery and exceptional service.</p>
          <a href="/register" className="cta-button">Sign Up Now</a>
        </section>
      </section>

    </div>
  );
};

export default Blog;