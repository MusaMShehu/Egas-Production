import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../api/ProductApi';
import { cartAPI } from '../../api/cartApi';
import OrderSummary from '../User/UserOrders/OrderSummary';
import './ProductSelection.css';

const ProductSelection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsData = await productAPI.getAllProducts({
          isActive: true,
        });

        // Handle both array and { data: [] } responses
        const items = Array.isArray(productsData)
          ? productsData
          : productsData?.data || [];

        setProducts(items);
        setFilteredProducts(items);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart items if user is logged in
  useEffect(() => {
    const fetchCartItems = async () => {
      if (isLoggedIn()) {
        try {
          const cartData = await cartAPI.getCart();
          setCartItems(cartData.items || []);
        } catch (err) {
          console.error('Failed to fetch cart:', err);
        }
      }
    };

    fetchCartItems();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'price-high':
          return (b.price ?? 0) - (a.price ?? 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
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

  const handleAddToCart = async (product) => {
    if (!isLoggedIn()) {
      setAuthMessage('Please login to your account to add items to cart');
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Please login to add items to your cart',
            returnUrl: window.location.pathname,
          },
        });
      }, 1500);
      return;
    }

    try {
      setAuthMessage('');
      const updatedCart = await cartAPI.addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image,
      });

      setCartItems(updatedCart.items || []);

      // Show success message
      setAuthMessage(`Added ${product.name} to cart!`);
      setTimeout(() => setAuthMessage(''), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setAuthMessage('Failed to add product to cart. Please try again.');
      setTimeout(() => setAuthMessage(''), 3000);
    }
  };

  const handleViewCart = () => {
    if (!isLoggedIn()) {
      setAuthMessage('Please login to view your cart');
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Please login to view your cart',
            returnUrl: window.location.pathname,
          },
        });
      }, 1500);
      return;
    }
    setShowOrderSummary(true);
  };

  const handleCloseOrderSummary = () => {
    setShowOrderSummary(false);
  };

  const handleUpdateCart = async (updates) => {
    try {
      const updatedCart = await cartAPI.updateCart(updates);
      setCartItems(updatedCart.items || []);
    } catch (err) {
      console.error('Failed to update cart:', err);
      setAuthMessage('Failed to update cart. Please try again.');
      setTimeout(() => setAuthMessage(''), 3000);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price ?? 0) * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Products</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="product-selection-container">
      {/* Auth Message */}
      {authMessage && (
        <div
          className={`auth-message ${
            authMessage.includes('Please login') ? 'error' : 'success'
          }`}
        >
          {authMessage}
          {authMessage.includes('Please login') && (
            <span className="redirecting">Redirecting to login...</span>
          )}
        </div>
      )}

      {/* Cart Floating Button */}
      <div className="cart-floating-button" onClick={handleViewCart}>
        <i className="fas fa-shopping-cart"></i>
        {getCartItemCount() > 0 && (
          <span className="cart-badge">{getCartItemCount()}</span>
        )}
      </div>

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
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image || 'default-product.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'default-product.jpg';
                  }}
                />
                {product.stock === 0 && (
                  <div className="out-of-stock">Out of Stock</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span
                    className={`product-stock ${
                      product.stock === 0 ? 'out' : 'in'
                    }`}
                  >
                    {product.stock === 0
                      ? 'Out of stock'
                      : `${product.stock} in stock`}
                  </span>
                </div>
                <div className="product-price">
                  ${(product.price ?? 0).toFixed(2)}
                </div>
                <button
                  className="add-to-cart-btn"
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Summary Modal */}
      {showOrderSummary && (
        <OrderSummary
          cartItems={cartItems}
          onClose={handleCloseOrderSummary}
          onUpdateCart={handleUpdateCart}
          total={getCartTotal()}
        />
      )}
    </div>
  );
};

export default ProductSelection;
