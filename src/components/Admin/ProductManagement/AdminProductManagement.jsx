import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaDownload, 
  FaExclamationCircle, 
  FaTimes, 
  FaCheckCircle, 
  FaSpinner, 
  FaSave, 
  FaPlus, 
  FaBoxOpen, 
  FaBox, 
  FaEdit, 
  FaEyeSlash, 
  FaEye, 
  FaTrash, 
  FaArrowUp, 
  FaArrowDown, 
  FaChevronLeft, 
  FaChevronRight,
  FaCheck,
  FaPauseCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { productAPI } from '../../../api/ProductApi';
import './AdminProductManagement.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Advanced state management
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Advanced filtering and sorting
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    stock: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Role-based access control
  const [userRole, setUserRole] = useState('admin'); // Default to admin

  // Fetch products
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

  // Advanced filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = filters.search === '' || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === '' || product.category === filters.category;
      const matchesStatus = filters.status === '' || 
        (filters.status === 'active' ? product.isActive : !product.isActive);
      
      const matchesStock = filters.stock === '' || 
        (filters.stock === 'inStock' ? product.stock > 0 : 
         filters.stock === 'lowStock' ? product.stock > 0 && product.stock <= 10 : 
         filters.stock === 'outOfStock' ? product.stock === 0 : true);

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'price' || sortConfig.key === 'stock') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, filters, sortConfig]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  // Enhanced form handling
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      if (file.size > maxSize) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError(null);
    }
  };

  // Enhanced validation matching backend schema
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
    
    if (!formData.price || isNaN(formData.price)) {
      errors.price = 'Valid price is required';
    } else if (parseFloat(formData.price) < 0) {
      errors.price = 'Price must be at least 0';
    }
    
    if (!formData.stock || isNaN(formData.stock)) {
      errors.stock = 'Valid stock is required';
    } else if (parseInt(formData.stock) < 0) {
      errors.stock = 'Stock cannot be negative';
    }
    
    if (formData.category && !['gas', 'accessory'].includes(formData.category)) {
      errors.category = 'Category must be either gas or accessory';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formPayload = new FormData();
      formPayload.append('name', formData.name.trim());
      formPayload.append('description', formData.description.trim());
      formPayload.append('price', parseFloat(formData.price));
      formPayload.append('stock', parseInt(formData.stock));
      formPayload.append('category', formData.category);
      formPayload.append('isActive', formData.isActive);
      
      if (imageFile) {
        formPayload.append('image', imageFile);
      }

      if (isEditing && editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formPayload, true);
        setSuccessMessage('Product updated successfully!');
      } else {
        await productAPI.createProduct(formPayload, true);
        setSuccessMessage('Product created successfully!');
      }

      resetForm();
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      isActive: true,
    });
    setImageFile(null);
    setFormErrors({});
    setEditingProduct(null);
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = (product) => {
    if (!hasPermission('edit')) {
      setError('You do not have permission to edit products');
      return;
    }

    setEditingProduct(product);
    setIsEditing(true);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category || '',
      stock: product.stock.toString(),
      isActive: product.isActive,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    if (!hasPermission('toggle')) {
      setError('You do not have permission to change product status');
      return;
    }

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

  const handleDelete = async (productId) => {
    if (!hasPermission('delete')) {
      setError('You do not have permission to delete products');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
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

  // Role-based permission system
  const hasPermission = (action) => {
    const permissions = {
      admin: ['create', 'edit', 'delete', 'toggle', 'view'],
      manager: ['create', 'edit', 'toggle', 'view'],
      editor: ['edit', 'view'],
      viewer: ['view']
    };

    return permissions[userRole]?.includes(action) || false;
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      stock: '',
      search: ''
    });
    setCurrentPage(1);
  };

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Export functionality
  const exportProducts = () => {
    const data = filteredAndSortedProducts.map(product => ({
      Name: product.name,
      Description: product.description,
      Price: product.price,
      Category: product.category,
      Stock: product.stock,
      Status: product.isActive ? 'Active' : 'Inactive',
      'Created Date': new Date(product.createdAt).toLocaleDateString()
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="apm-admin-container">
      <header className="apm-admin-header">
        <div className="apm-header-content">
          <div>
            <h1>Product Management</h1>
            <p>Add, edit, and manage products in your store</p>
          </div>
          <div className="apm-header-actions">
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="apm-role-selector"
            >
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button onClick={exportProducts} className="apm-btn-export">
              <FaDownload className="apm-icon" /> Export CSV
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="apm-admin-error-message">
          <FaExclamationCircle className="apm-icon" />
          {error}
          <button onClick={() => setError(null)} className="apm-close-error">
            <FaTimes className="apm-icon" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="apm-admin-success-message">
          <FaCheckCircle className="apm-icon" />
          {successMessage}
        </div>
      )}

      <div className="apm-admin-content">
        {/* Advanced Filters Section */}
        <div className="apm-filters-section">
          <div className="apm-filters-header">
            <h3>Filters & Search</h3>
            <button onClick={clearFilters} className="apm-btn-clear-filters">
              Clear All Filters
            </button>
          </div>
          
          <div className="apm-filters-grid">
            <div className="apm-filter-group">
              <label>Search Products</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="apm-search-input"
              />
            </div>

            <div className="apm-filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="gas">Gas</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>

            <div className="apm-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="apm-filter-group">
              <label>Stock Level</label>
              <select
                value={filters.stock}
                onChange={(e) => handleFilterChange('stock', e.target.value)}
              >
                <option value="">All Stock</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock (≤ 10)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Form Section */}
        {hasPermission('create') && (
          <div className="apm-product-form-section">
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

            <form onSubmit={handleSubmit} className="apm-product-form">
              <div className="apm-form-row">
                <div className="apm-form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                  <div className="apm-char-counter">{formData.name.length}/100</div>
                  {formErrors.name && <span className="apm-error-text">{formErrors.name}</span>}
                </div>

                <div className="apm-form-group">
                  <label>Price ($) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                  {formErrors.price && <span className="apm-error-text">{formErrors.price}</span>}
                </div>
              </div>

              <div className="apm-form-group">
                <label>Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows="3"
                />
                {formErrors.description && <span className="apm-error-text">{formErrors.description}</span>}
              </div>

              <div className="apm-form-row">
                <div className="apm-form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    <option value="gas">Gas</option>
                    <option value="accessory">Accessory</option>
                  </select>
                  {formErrors.category && <span className="apm-error-text">{formErrors.category}</span>}
                </div>

                <div className="apm-form-group">
                  <label>Stock *</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleInputChange}
                    min="0"
                  />
                  {formErrors.stock && <span className="apm-error-text">{formErrors.stock}</span>}
                </div>
              </div>

              <div className="apm-form-row">
                <div className="apm-form-group">
                  <label>Product Image</label>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/jpg, image/png, image/webp" 
                    onChange={handleImageChange}
                  />
                  <small>JPEG, PNG, WebP (Max 5MB)</small>
                </div>

                <div className="apm-form-group apm-checkbox-group">
                  <label>Status</label>
                  <div className="apm-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={formData.isActive} 
                      onChange={handleInputChange}
                    />
                    <span>Active Product</span>
                  </div>
                </div>
              </div>

              {imageFile && (
                <div className="apm-image-preview">
                  <img src={URL.createObjectURL(imageFile)} alt="preview" />
                  <button 
                    type="button" 
                    onClick={() => setImageFile(null)}
                    className="apm-btn-remove-image"
                  >
                    <FaTimes className="apm-icon" />
                  </button>
                </div>
              )}

              <div className="apm-form-actions">
                <button type="submit" className="apm-btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className="apm-icon apm-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <FaSave className="apm-icon" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <FaPlus className="apm-icon" />
                      Add Product
                    </>
                  )}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="apm-btn-secondary">
                    <FaTimes className="apm-icon" />
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Products List Section */}
        <div className="apm-products-list-section">
          <div className="apm-section-header">
            <div>
              <h2>Product List</h2>
              <p>
                Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>
            <div className="apm-list-controls">
              <select 
                value={itemsPerPage} 
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="apm-page-size-selector"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="apm-loading-state">
              <FaSpinner className="apm-icon apm-spin" />
              <p>Loading products...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="apm-no-products">
              <FaBoxOpen className="apm-icon" />
              <h3>No products found</h3>
              <p>Try adjusting your filters or add a new product</p>
            </div>
          ) : (
            <>
              <div className="apm-products-table-container">
                <table className="apm-products-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')} className="apm-sortable">
                        Name {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                        )}
                      </th>
                      <th onClick={() => handleSort('category')} className="apm-sortable">
                        Category {sortConfig.key === 'category' && (
                          sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                        )}
                      </th>
                      <th onClick={() => handleSort('price')} className="apm-sortable">
                        Price {sortConfig.key === 'price' && (
                          sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                        )}
                      </th>
                      <th onClick={() => handleSort('stock')} className="apm-sortable">
                        Stock {sortConfig.key === 'stock' && (
                          sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                        )}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map(product => (
                      <tr key={product._id} className={!product.isActive ? 'apm-inactive' : ''}>
                        <td>
                          <div className="apm-product-name-cell">
                            {product.image && product.image !== 'default-product.jpg' ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="apm-default-image">
                                <FaBox className="apm-icon" />
                              </div>
                            )}
                            <div className="apm-product-info">
                              <span className="apm-product-name">{product.name}</span>
                              <span className="apm-product-description">{product.description.substring(0, 50)}...</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`apm-category-badge ${product.category || 'apm-uncategorized'}`}>
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <span className={`apm-stock-badge ${
                            product.stock === 0 ? 'apm-out' : 
                            product.stock <= 10 ? 'apm-low' : 'apm-in'
                          }`}>
                            {product.stock}
                            {product.stock <= 10 && product.stock > 0 && (
                              <FaExclamationTriangle className="apm-icon" />
                            )}
                          </span>
                        </td>
                        <td>
                          <span className={`apm-status-badge ${product.isActive ? 'apm-active' : 'apm-inactive'}`}>
                            {product.isActive ? <FaCheck className="apm-icon" /> : <FaPauseCircle className="apm-icon" />}
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="apm-action-buttons">
                            {hasPermission('edit') && (
                              <button 
                                className="apm-btn-edit"
                                onClick={() => handleEdit(product)}
                                title="Edit product"
                              >
                                <FaEdit className="apm-icon" />
                              </button>
                            )}
                            
                            {hasPermission('toggle') && (
                              <button 
                                className={product.isActive ? 'apm-btn-deactivate' : 'apm-btn-activate'}
                                onClick={() => toggleProductStatus(product._id, product.isActive)}
                                title={product.isActive ? 'Deactivate product' : 'Activate product'}
                              >
                                {product.isActive ? <FaEyeSlash className="apm-icon" /> : <FaEye className="apm-icon" />}
                              </button>
                            )}
                            
                            {hasPermission('delete') && (
                              <button 
                                className="apm-btn-delete"
                                onClick={() => handleDelete(product._id)}
                                title="Delete product"
                              >
                                <FaTrash className="apm-icon" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="apm-pagination">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="apm-pagination-btn"
                  >
                    <FaChevronLeft className="apm-icon" /> Previous
                  </button>
                  
                  <div className="apm-pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`apm-pagination-page ${currentPage === page ? 'apm-active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className="apm-pagination-btn"
                  >
                    Next <FaChevronRight className="apm-icon" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagement;