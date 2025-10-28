import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaFilter, FaSortAmountDown, FaExclamationTriangle } from 'react-icons/fa';
import { productAPI } from '../../api/ProductApi';
import cartAPI from '../../api/cartApi';
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
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Check login
  const isLoggedIn = () => localStorage.getItem('token') !== null;

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsData = await productAPI.getAllProducts({ isActive: true });
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

  // ✅ Fetch cart
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

  // ✅ Filtering & sorting
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

  // ✅ Add to cart
  const handleAddToCart = async (product) => {
    if (!isLoggedIn()) {
      setAuthMessage('Please login to your account to add items to cart');
      setTimeout(() => {
        navigate('/auth', {
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
      });

      setCartItems(updatedCart.items || []);

      setAuthMessage(`Added ${product.name} to cart!`);
      setTimeout(() => setAuthMessage(''), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setAuthMessage('Failed to add product to cart. Please try again.');
      setTimeout(() => setAuthMessage(''), 3000);
    }
  };

  // ✅ View cart



const handleViewCart = () => {
  navigate("/cart"); // redirect to Cart page
};

  const getCartItemCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  if (loading) {
    return (
      <div className="pro-sel-loading-container">
        <div className="pro-sel-loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pro-sel-error-container">
        <FaExclamationTriangle className="pro-sel-error-icon" />
        <h3>Error Loading Products</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="pro-sel-container">
      {/* Auth Message */}
      {authMessage && (
        <div
          className={`pro-sel-auth-message ${
            authMessage.includes('Please login') ? 'error' : 'success'
          }`}
        >
          {authMessage}
          {authMessage.includes('Please login') && (
            <span className="pro-sel-redirecting">Redirecting to login...</span>
          )}
        </div>
      )}

      {/* Cart Floating Button */}
      <div className="pro-sel-cart-floating-button" onClick={handleViewCart}>
        <FaShoppingCart className="pro-sel-cart-icon" />
        {getCartItemCount() > 0 && (
          <span className="pro-sel-cart-badge">{getCartItemCount()}</span>
        )}
      </div>

      <div className="pro-sel-page-header">
        <h3>Gas cylinder & accessories</h3>
      </div>

      <div className="pro-sel-controls-section">
        <div className="pro-sel-search-box">
          <FaSearch className="pro-sel-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="pro-sel-filter-controls">
          <div className="pro-sel-category-filter">
            <div className='pro-sel-filter-label-icon'>
              <span className="pro-sel-filter-label">
                <FaFilter className="pro-sel-filter-icon" />
                Filter by:
              </span>
            </div>
            <div className='pro-sel-categiry-filter-btn'>
              <button
                className={selectedCategory === 'all' ? 'active' : ''}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </button>
              <button
                className= {selectedCategory === 'gas' ? 'active' : ''}
                onClick={() => setSelectedCategory('gas')}
              >
                Gas
              </button>
              <button
                className={selectedCategory === 'accessory' ? 'active' : ''}
                onClick={() => setSelectedCategory('accessory')}
              >
                Accessories
              </button>
            </div>
          </div>

          <div className="pro-sel-sort-filter">
            <FaSortAmountDown className="pro-sel-sort-icon" />
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="pro-sel-products-grid">
        {filteredProducts.length === 0 ? (
          <div className="pro-sel-no-products">
            <FaSearch className="pro-sel-no-products-icon" />
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="pro-sel-product-card">
              <div className="pro-sel-product-image">
                <img
                  src={
                    product.image
                      ? product.image
                      : '/images/default-product.jpg'
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/logo.png';
                  }}
                />
                {product.stock === 0 && (
                  <div className="pro-sel-out-of-stock">Out of Stock</div>
                )}
              </div>
              <div className="pro-sel-product-info">
                <h3>{product.name}</h3>
                <p className="pro-sel-product-description">{product.description}</p>
                <div className="pro-sel-product-meta">
                  <span className="pro-sel-product-category">{product.category}</span>
                  <span
                    className={`pro-sel-product-stock ${
                      product.stock === 0 ? 'out' : 'in'
                    }`}
                  >
                    {product.stock === 0
                      ? 'Out of stock'
                      : `${product.stock} in stock`}
                  </span>
                </div>
                <div className="pro-sel-product-price">
                  ₦{(product.price ?? 0).toFixed(2)}
                </div>
                <button
                  className="pro-sel-add-to-cart-btn"
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
    </div>
  );
};

export default ProductSelection;

