import React, { useState, useEffect } from 'react';
import './ProductSelection.css';

const ProductSelection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          _id: '1',
          name: 'Propane Gas Tank',
          description: '20lb propane tank for grilling and heating',
          price: 49.99,
          image: 'propane-tank.jpg',
          category: 'gas',
          stock: 25,
          isActive: true,
          createdAt: '2023-05-15'
        },
        {
          _id: '2',
          name: 'Gas Grill',
          description: 'Stainless steel gas grill with side burner',
          price: 399.99,
          image: 'gas-grill.jpg',
          category: 'accessory',
          stock: 12,
          isActive: true,
          createdAt: '2023-06-20'
        },
        {
          _id: '3',
          name: 'Butane Canister',
          description: '8oz butane fuel canister for portable stoves',
          price: 12.99,
          image: 'butane-canister.jpg',
          category: 'gas',
          stock: 0,
          isActive: true,
          createdAt: '2023-07-05'
        },
        {
          _id: '4',
          name: 'Gas Hose',
          description: '5ft high-pressure gas hose with fittings',
          price: 24.99,
          image: 'gas-hose.jpg',
          category: 'accessory',
          stock: 18,
          isActive: true,
          createdAt: '2023-04-10'
        },
        {
          _id: '5',
          name: 'Natural Gas Conversion Kit',
          description: 'Conversion kit for propane to natural gas',
          price: 89.99,
          image: 'conversion-kit.jpg',
          category: 'accessory',
          stock: 7,
          isActive: true,
          createdAt: '2023-08-12'
        },
        {
          _id: '6',
          name: 'Portable Gas Heater',
          description: 'Indoor-safe portable propane heater',
          price: 149.99,
          image: 'portable-heater.jpg',
          category: 'accessory',
          stock: 5,
          isActive: true,
          createdAt: '2023-09-01'
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    result.sort((a, b) => {
      switch(sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortOption]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-selection-container">
      <header className="page-header">
        <h1>Gas & Accessories Store</h1>
        <p>Find the perfect gas products and accessories for your needs</p>
      </header>

      <div className="controls-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-controls">
          <div className="category-filter">
            <button 
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => handleCategoryChange('all')}
            >
              All Products
            </button>
            <button 
              className={selectedCategory === 'gas' ? 'active' : ''}
              onClick={() => handleCategoryChange('gas')}
            >
              Gas
            </button>
            <button 
              className={selectedCategory === 'accessory' ? 'active' : ''}
              onClick={() => handleCategoryChange('accessory')}
            >
              Accessories
            </button>
          </div>

          <div className="sort-filter">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortOption} onChange={handleSortChange}>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <i className="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image || 'default-product.jpg'} alt={product.name} />
                {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span className={`product-stock ${product.stock === 0 ? 'out' : 'in'}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                  </span>
                </div>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button 
                  className="add-to-cart-btn"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductSelection;