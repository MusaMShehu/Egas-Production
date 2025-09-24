import React, { useState, useEffect } from 'react';
import { productAPI } from '../../../api/ProductApi';
import './AdminProductManagement.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    isActive: true
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productAPI.getAllProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Product name cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Product description is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Valid price is required (minimum 0)';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'Valid stock quantity is required (minimum 0)';
    }

    if (formData.category && !['gas', 'accessory'].includes(formData.category)) {
      errors.category = 'Category must be either gas or accessory';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (isEditing && editingProduct) {
        // Update existing product
        await productAPI.updateProduct(editingProduct._id, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        // Create new product
        await productAPI.createProduct(productData);
        setSuccessMessage('Product created successfully!');
      }

      // Reset form and refresh product list
      resetForm();
      fetchProducts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      stock: '',
      isActive: true
    });
    setFormErrors({});
    setEditingProduct(null);
    setIsEditing(false);
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image || '',
      category: product.category || '',
      stock: product.stock.toString(),
      isActive: product.isActive
    });
    window.scrollTo(0, 0);
  };

  // Toggle product status
  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      setLoading(true);
      await productAPI.updateProduct(productId, { isActive: !currentStatus });
      setSuccessMessage(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update product status:', err);
      setError('Failed to update product status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await productAPI.deleteProduct(productId);
      setSuccessMessage('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Product Management</h1>
        <p>Add, edit, and manage products in your store</p>
      </header>

      {error && (
        <div className="admin-error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {successMessage && (
        <div className="admin-success-message">
          <i className="fas fa-check-circle"></i>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="admin-content">
        <div className="product-form-section">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                  placeholder="Enter product name"
                />
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={formErrors.price ? 'error' : ''}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {formErrors.price && <span className="error-text">{formErrors.price}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={formErrors.description ? 'error' : ''}
                placeholder="Enter product description"
                rows="4"
              />
              {formErrors.description && <span className="error-text">{formErrors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={formErrors.category ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  <option value="gas">Gas</option>
                  <option value="accessory">Accessory</option>
                </select>
                {formErrors.category && <span className="error-text">{formErrors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={formErrors.stock ? 'error' : ''}
                  placeholder="0"
                  min="0"
                />
                {formErrors.stock && <span className="error-text">{formErrors.stock}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="form-group checkbox-group">
                <label htmlFor="isActive">Status</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Active Product</span>
                </div>
              </div>
            </div>

            {formData.image && (
              <div className="image-preview">
                <p>Image Preview:</p>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
              </button>
              
              {isEditing && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-list-section">
          <h2>Product List</h2>
          <p>Manage existing products</p>

          {products.length === 0 ? (
            <div className="no-products">
              <i className="fas fa-box-open"></i>
              <h3>No products found</h3>
              <p>Add your first product using the form above</p>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className={!product.isActive ? 'inactive' : ''}>
                      <td>
                        <div className="product-name-cell">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category || '-'}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`stock-badge ${product.stock === 0 ? 'out' : 'in'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          
                          <button 
                            className={product.isActive ? 'btn-deactivate' : 'btn-activate'}
                            onClick={() => toggleProductStatus(product._id, product.isActive)}
                            title={product.isActive ? 'Deactivate product' : 'Activate product'}
                          >
                            <i className={product.isActive ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                          </button>
                          
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(product._id)}
                            title="Delete product"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagement;