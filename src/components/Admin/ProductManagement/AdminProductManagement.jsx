import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaDownload, 
  FaExclamationCircle, 
  FaTimes, 
  FaCheckCircle, 
  FaSpinner, 
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
  FaExclamationTriangle,
  FaUpload,
  FaGasPump,
  FaCalendarAlt,
  FaStar,
  FaCog
} from 'react-icons/fa';
import './AdminProductManagement.css';


const getAuthHeaders = () => ({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

const SUB_URL = 'http://localhost:5000/api/v1/admin/subscription-plans';

// Inline API functions for Products
const productAPI = {
  getAllProducts: async () => {
    const response = await fetch('http://localhost:5000/api/v1/admin/products', {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  },

  createProduct: async (productData) => {
    const response = await fetch('http://localhost:5000/api/v1/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  },

  updateProduct: async (productId, productData) => {
    const response = await fetch(`http://localhost:5000/api/v1/admin/products/update-product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  },

  deleteProduct: async (productId) => {
    const response = await fetch(`http://localhost:5000/api/v1/admin/products/delete-product/${productId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return await response.json();
  },

  uploadProductPhoto: async (productId, file) => {
  try {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found: Admin login required");
    }

    const formData = new FormData();
    formData.append("photo", file); // MUST match backend field name

    const response = await fetch(
      `http://localhost:5000/api/v1/admin/products/${productId}/photo`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Required by protect middleware
        },
        body: formData,
      }
    );

    // Direct error text for clarity
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to upload photo: ${errText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
},

};


// Inline API functions for Subscription Plans
const subscriptionPlanAPI = {
  getAllPlans: async () => {
    const response = await fetch(SUB_URL, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to fetch subscription plans');
    return await response.json();
  },

  createPlan: async (planData) => {
    const response = await fetch(SUB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(planData),
    });
    if (!response.ok) throw new Error('Failed to create subscription plan');
    return await response.json();
  },

  updatePlan: async (planId, planData) => {
    const response = await fetch(`${SUB_URL}/${planId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(planData),
    });
    if (!response.ok) throw new Error('Failed to update subscription plan');
    return await response.json();
  },

  deletePlan: async (planId) => {
    const response = await fetch(`${SUB_URL}/${planId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to delete subscription plan');
    return await response.json();
  },

  togglePlanPopular: async (planId, currentStatus) => {
    const response = await fetch(`${SUB_URL}/${planId}/popular`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ isPopular: !currentStatus }),
    });
    if (!response.ok) throw new Error('Failed to update popular status');
    return await response.json();
  }
};


// Product Form Modal Component
const ProductFormModal = ({ isOpen, onClose, onSave, onError, mode, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        isActive: true
      });
    }
  }, [mode, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (mode === 'create') {
        await productAPI.createProduct(productData);
        onSave('Product created successfully!');
      } else {
        await productAPI.updateProduct(product._id, productData);
        onSave('Product updated successfully!');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="apm-modal-overlay">
      <div className="apm-modal">
        <div className="apm-modal-header">
          <h2>{mode === 'create' ? 'Create New Product' : 'Edit Product'}</h2>
          <button onClick={onClose} className="apm-modal-close">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="apm-modal-form">
          <div className="apm-form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="apm-form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
            />
          </div>
          <div className="apm-form-row">
            <div className="apm-form-group">
              <label>Price (₦) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="apm-form-group">
              <label>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="apm-form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="gas">Gas</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>
          <div className="apm-form-group">
            <label className="apm-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active Product
            </label>
          </div>
          <div className="apm-modal-actions">
            <button type="button" onClick={onClose} className="apm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="apm-btn-primary" disabled={loading}>
              {loading ? <FaSpinner className="apm-spin" /> : (mode === 'create' ? 'Create Product' : 'Update Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Subscription Plan Form Modal Component
const SubscriptionPlanFormModal = ({ isOpen, onClose, onSave, onError, mode, plan }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    baseSize: '',
    basePrice: '',
    pricePerKg: '1500',
    type: 'preset',
    isActive: true,
    isPopular: false,
    deliveryFrequency: [],
    subscriptionPeriod: [],
    cylinderSizes: [],
    features: [{ title: '', description: '', included: true }]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        shortDescription: plan.shortDescription || '',
        baseSize: plan.baseSize || '',
        basePrice: plan.basePrice || '',
        pricePerKg: plan.pricePerKg || '1500',
        type: plan.type || 'preset',
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        isPopular: plan.isPopular || false,
        deliveryFrequency: plan.deliveryFrequency || [],
        subscriptionPeriod: plan.subscriptionPeriod || [],
        cylinderSizes: plan.cylinderSizes || [],
        features: plan.features && plan.features.length > 0 ? plan.features : [{ title: '', description: '', included: true }]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        baseSize: '',
        basePrice: '',
        pricePerKg: '1500',
        type: 'preset',
        isActive: true,
        isPopular: false,
        deliveryFrequency: [],
        subscriptionPeriod: [],
        cylinderSizes: [],
        features: [{ title: '', description: '', included: true }]
      });
    }
  }, [mode, plan]);

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: '', description: '', included: true }]
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleArrayFieldChange = (field, value, checked) => {
    const currentArray = formData[field] || [];
    let updatedArray;
    
    if (checked) {
      updatedArray = [...currentArray, value];
    } else {
      updatedArray = currentArray.filter(item => item !== value);
    }
    
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const planData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        pricePerKg: parseFloat(formData.pricePerKg),
        features: formData.features.filter(f => f.title && f.description)
      };

      if (mode === 'create') {
        await subscriptionPlanAPI.createPlan(planData);
        onSave('Subscription plan created successfully!');
      } else {
        await subscriptionPlanAPI.updatePlan(plan._id, planData);
        onSave('Subscription plan updated successfully!');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="apm-modal-overlay">
      <div className="apm-modal apm-modal-large">
        <div className="apm-modal-header">
          <h2>{mode === 'create' ? 'Create New Subscription Plan' : 'Edit Subscription Plan'}</h2>
          <button onClick={onClose} className="apm-modal-close">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="apm-modal-form">
          <div className="apm-form-row">
            <div className="apm-form-group">
              <label>Plan Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="apm-form-group">
              <label>Base Size *</label>
              <input
                type="text"
                value={formData.baseSize}
                onChange={(e) => setFormData({ ...formData, baseSize: e.target.value })}
                placeholder="e.g., 6kg"
                required
              />
            </div>
          </div>

          <div className="apm-form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="2"
            />
          </div>

          <div className="apm-form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description (max 150 chars)"
              maxLength="150"
            />
          </div>

          <div className="apm-form-row">
            <div className="apm-form-group">
              <label>Base Price (₦) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
            </div>
            <div className="apm-form-group">
              <label>Price per Kg (₦)</label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
              />
            </div>
            <div className="apm-form-group">
              <label>Plan Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="preset">Preset</option>
                <option value="custom">Custom</option>
                <option value="one-time">One-Time</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Conditional fields based on plan type */}
          {(formData.type === 'preset' || formData.type === 'emergency') && (
            <div className="apm-form-group">
              <label>Delivery Frequency</label>
              <div className="apm-checkbox-group">
                {['Daily', 'Weekly', 'Bi-weekly', 'Monthly'].map(freq => (
                  <label key={freq} className="apm-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.deliveryFrequency.includes(freq)}
                      onChange={(e) => handleArrayFieldChange('deliveryFrequency', freq, e.target.checked)}
                    />
                    {freq}
                  </label>
                ))}
              </div>
            </div>
          )}

          {(formData.type === 'one-time' || formData.type === 'emergency') && (
            <div className="apm-form-group">
              <label>Cylinder Sizes</label>
              <input
                type="text"
                value={formData.cylinderSizes.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  cylinderSizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                placeholder="e.g., 6kg, 12.5kg, 25kg"
              />
            </div>
          )}

          {formData.type !== 'one-time' && (
            <div className="apm-form-group">
              <label>Subscription Period (Months)</label>
              <div className="apm-checkbox-group">
                {[1, 3, 6, 12].map(month => (
                  <label key={month} className="apm-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.subscriptionPeriod.includes(month)}
                      onChange={(e) => handleArrayFieldChange('subscriptionPeriod', month, e.target.checked)}
                    />
                    {month} Month{month > 1 ? 's' : ''}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="apm-form-group">
            <label>Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="apm-feature-item">
                <div className="apm-form-row">
                  <div className="apm-form-group">
                    <input
                      type="text"
                      placeholder="Feature title"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="apm-form-group">
                    <input
                      type="text"
                      placeholder="Feature description"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="apm-form-group apm-feature-actions">
                    <label className="apm-checkbox-label">
                      <input
                        type="checkbox"
                        checked={feature.included}
                        onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                      />
                      Included
                    </label>
                    <button type="button" onClick={() => removeFeature(index)} className="apm-btn-danger">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addFeature} className="apm-btn-secondary">
              <FaPlus /> Add Feature
            </button>
          </div>

          <div className="apm-form-row">
            <label className="apm-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active Plan
            </label>
            <label className="apm-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              />
              Popular Plan
            </label>
          </div>

          <div className="apm-modal-actions">
            <button type="button" onClick={onClose} className="apm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="apm-btn-primary" disabled={loading}>
              {loading ? <FaSpinner className="apm-spin" /> : (mode === 'create' ? 'Create Plan' : 'Update Plan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = ({ 
  products, 
  loading, 
  error, 
  successMessage,
  onRefresh,
  onEdit,
  onCreate,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  onUploadPhoto,
  hasPermission,
  filters,
  onFilterChange,
  sortConfig,
  onSort,
  paginatedProducts,
  totalPages,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  return (
    <div className="apm-section">
      <div className="apm-section-header">
        <div>
          <h2><FaGasPump className="apm-icon" /> Products Management</h2>
          <p>
            Showing {paginatedProducts.length} of {products.length} products
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>
        <div className="apm-list-controls">
          <select 
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="apm-page-size-selector"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          
          {hasPermission('create') && (
            <button onClick={onCreate} className="apm-btn-primary">
              <FaPlus className="apm-icon" /> Create Product
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="apm-loading-state">
          <FaSpinner className="apm-icon apm-spin" />
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="apm-no-data">
          <FaBoxOpen className="apm-icon" />
          <h3>No products found</h3>
          <p>Try adjusting your filters or add a new product</p>
          {hasPermission('create') && (
            <button onClick={onCreate} className="apm-btn-primary">
              <FaPlus className="apm-icon" /> Create Your First Product
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="apm-table-container">
            <table className="apm-table">
              <thead>
                <tr>
                  <th onClick={() => onSort('name')} className="apm-sortable">
                    Product {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                    )}
                  </th>
                  <th onClick={() => onSort('category')} className="apm-sortable">
                    Category {sortConfig.key === 'category' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                    )}
                  </th>
                  <th onClick={() => onSort('price')} className="apm-sortable">
                    Price {sortConfig.key === 'price' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                    )}
                  </th>
                  <th onClick={() => onSort('stock')} className="apm-sortable">
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
                            src={`/uploads/products/${product.image}`} 
                            alt={product.name}
                            className="apm-product-image"
                          />
                        ) : (
                          <div className="apm-default-image">
                            <FaBox className="apm-icon" />
                          </div>
                        )}
                        <div className="apm-product-info">
                          <span className="apm-product-name">{product.name}</span>
                          <span className="apm-product-description">
                            {product.description.substring(0, 50)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`apm-category-badge ${product.category || 'apm-uncategorized'}`}>
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <div className="apm-price-info">
                        <span className="apm-price-main">₦{product.price?.toLocaleString()}</span>
                      </div>
                    </td>
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
                            onClick={() => onEdit(product)}
                            title="Edit product"
                          >
                            <FaEdit className="apm-icon" />
                          </button>
                        )}
                        
                        {hasPermission('upload') && (
                          <button 
                            className="apm-btn-upload"
                            onClick={() => document.getElementById(`upload-${product._id}`)?.click()}
                            title="Upload photo"
                          >
                            <FaUpload className="apm-icon" />
                            <input
                              id={`upload-${product._id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  onUploadPhoto(product._id, e.target.files[0]);
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                          </button>
                        )}
                        
                        {hasPermission('toggle') && (
                          <button 
                            className={product.isActive ? 'apm-btn-deactivate' : 'apm-btn-activate'}
                            onClick={() => onToggleStatus(product._id, product.isActive)}
                            title={product.isActive ? 'Deactivate product' : 'Activate product'}
                          >
                            {product.isActive ? <FaEyeSlash className="apm-icon" /> : <FaEye className="apm-icon" />}
                          </button>
                        )}
                        
                        {hasPermission('delete') && (
                          <button 
                            className="apm-btn-delete"
                            onClick={() => onDelete(product._id)}
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
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="apm-pagination-btn"
              >
                <FaChevronLeft className="apm-icon" /> Previous
              </button>
              
              <div className="apm-pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`apm-pagination-page ${currentPage === page ? 'apm-active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => onPageChange(currentPage + 1)} 
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
  );
};

// Subscription Plans Management Component
const SubscriptionPlansManagement = ({ 
  plans, 
  loading, 
  error, 
  successMessage,
  onRefresh,
  onEdit,
  onCreate,
  onDelete,
  onToggleStatus,
  onTogglePopular,
  hasPermission,
  filters,
  onFilterChange,
  sortConfig,
  onSort,
  paginatedPlans,
  totalPages,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  return (
    <div className="apm-section">
      <div className="apm-section-header">
        <div>
          <h2><FaCalendarAlt className="apm-icon" /> Subscription Plans Management</h2>
          <p>
            Showing {paginatedPlans.length} of {plans.length} plans
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>
        <div className="apm-list-controls">
          <select 
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="apm-page-size-selector"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          
          {hasPermission('create') && (
            <button onClick={onCreate} className="apm-btn-primary">
              <FaPlus className="apm-icon" /> Create Plan
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="apm-loading-state">
          <FaSpinner className="apm-icon apm-spin" />
          <p>Loading subscription plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="apm-no-data">
          <FaCalendarAlt className="apm-icon" />
          <h3>No subscription plans found</h3>
          <p>Try adjusting your filters or add a new plan</p>
          {hasPermission('create') && (
            <button onClick={onCreate} className="apm-btn-primary">
              <FaPlus className="apm-icon" /> Create Your First Plan
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="apm-table-container">
            <table className="apm-table">
              <thead>
                <tr>
                  <th onClick={() => onSort('name')} className="apm-sortable">
                    Plan Name {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                    )}
                  </th>
                  <th onClick={() => onSort('type')} className="apm-sortable">
                    Type {sortConfig.key === 'type' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                    )}
                  </th>
                  <th onClick={() => onSort('basePrice')} className="apm-sortable">
                    Base Price {sortConfig.key === 'basePrice' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="apm-icon" /> : <FaArrowDown className="apm-icon" />
                    )}
                  </th>
                  <th>Base Size</th>
                  <th>Popular</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlans.map(plan => (
                  <tr key={plan._id} className={!plan.isActive ? 'apm-inactive' : ''}>
                    <td>
                      <div className="apm-product-name-cell">
                        <div className="apm-default-image">
                          <FaCog className="apm-icon" />
                        </div>
                        <div className="apm-product-info">
                          <span className="apm-product-name">{plan.name}</span>
                          <span className="apm-product-description">
                            {plan.shortDescription || plan.description.substring(0, 50)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`apm-type-badge apm-type-${plan.type}`}>
                        {plan.type}
                      </span>
                    </td>
                    <td>
                      <div className="apm-price-info">
                        <span className="apm-price-main">₦{plan.basePrice?.toLocaleString()}</span>
                        {plan.pricePerKg && (
                          <span className="apm-price-secondary">₦{plan.pricePerKg}/kg</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="apm-size-badge">
                        {plan.baseSize}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`apm-popular-btn ${plan.isPopular ? 'apm-popular-active' : ''}`}
                        onClick={() => onTogglePopular(plan._id, plan.isPopular)}
                        title={plan.isPopular ? 'Remove from popular' : 'Mark as popular'}
                      >
                        {plan.isPopular ? <FaStar className="apm-icon" /> : <FaStar className="apm-icon" />}
                      </button>
                    </td>
                    <td>
                      <span className={`apm-status-badge ${plan.isActive ? 'apm-active' : 'apm-inactive'}`}>
                        {plan.isActive ? <FaCheck className="apm-icon" /> : <FaPauseCircle className="apm-icon" />}
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="apm-action-buttons">
                        {hasPermission('edit') && (
                          <button 
                            className="apm-btn-edit"
                            onClick={() => onEdit(plan)}
                            title="Edit plan"
                          >
                            <FaEdit className="apm-icon" />
                          </button>
                        )}
                        
                        {hasPermission('toggle') && (
                          <button 
                            className={plan.isActive ? 'apm-btn-deactivate' : 'apm-btn-activate'}
                            onClick={() => onToggleStatus(plan._id, plan.isActive)}
                            title={plan.isActive ? 'Deactivate plan' : 'Activate plan'}
                          >
                            {plan.isActive ? <FaEyeSlash className="apm-icon" /> : <FaEye className="apm-icon" />}
                          </button>
                        )}
                        
                        {hasPermission('delete') && (
                          <button 
                            className="apm-btn-delete"
                            onClick={() => onDelete(plan._id)}
                            title="Delete plan"
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
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="apm-pagination-btn"
              >
                <FaChevronLeft className="apm-icon" /> Previous
              </button>
              
              <div className="apm-pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`apm-pagination-page ${currentPage === page ? 'apm-active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => onPageChange(currentPage + 1)} 
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
  );
};

// Main Admin Product Management Component
const AdminProductManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);

  // Advanced filtering and sorting
  const [productFilters, setProductFilters] = useState({
    category: '',
    status: '',
    stock: '',
    search: '',
  });
  
  const [planFilters, setPlanFilters] = useState({
    type: '',
    status: '',
    popular: '',
    search: '',
  });

  const [productSortConfig, setProductSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [planSortConfig, setPlanSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentPlanPage, setCurrentPlanPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Role-based access control
  const [userRole, setUserRole] = useState('admin');

  // Fetch data from backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchProducts(),
        fetchSubscriptionPlans()
      ]);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data || response);
    } catch (err) {
      throw err;
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await subscriptionPlanAPI.getAllPlans();
      setPlans(response.data || response);
    } catch (err) {
      throw err;
    }
  };

  // Advanced filtering and sorting logic for products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = productFilters.search === '' || 
        product.name.toLowerCase().includes(productFilters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(productFilters.search.toLowerCase());
      
      const matchesCategory = productFilters.category === '' || product.category === productFilters.category;
      const matchesStatus = productFilters.status === '' || 
        (productFilters.status === 'active' ? product.isActive : !product.isActive);
      
      const matchesStock = productFilters.stock === '' || 
        (productFilters.stock === 'inStock' ? product.stock > 0 : 
         productFilters.stock === 'lowStock' ? product.stock > 0 && product.stock <= 10 : 
         productFilters.stock === 'outOfStock' ? product.stock === 0 : true);

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[productSortConfig.key];
      let bValue = b[productSortConfig.key];

      if (productSortConfig.key === 'price' || productSortConfig.key === 'stock' || productSortConfig.key === 'createdAt') {
        aValue = productSortConfig.key === 'createdAt' ? new Date(aValue) : Number(aValue);
        bValue = productSortConfig.key === 'createdAt' ? new Date(bValue) : Number(bValue);
      }

      if (aValue < bValue) {
        return productSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return productSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, productFilters, productSortConfig]);

  // Advanced filtering and sorting logic for plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = plans.filter(plan => {
      const matchesSearch = planFilters.search === '' || 
        plan.name.toLowerCase().includes(planFilters.search.toLowerCase()) ||
        plan.description.toLowerCase().includes(planFilters.search.toLowerCase());
      
      const matchesType = planFilters.type === '' || plan.type === planFilters.type;
      const matchesStatus = planFilters.status === '' || 
        (planFilters.status === 'active' ? plan.isActive : !plan.isActive);
      
      const matchesPopular = planFilters.popular === '' || 
        (planFilters.popular === 'popular' ? plan.isPopular : !plan.isPopular);

      return matchesSearch && matchesType && matchesStatus && matchesPopular;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[planSortConfig.key];
      let bValue = b[planSortConfig.key];

      if (planSortConfig.key === 'basePrice' || planSortConfig.key === 'createdAt') {
        aValue = planSortConfig.key === 'createdAt' ? new Date(aValue) : Number(aValue);
        bValue = planSortConfig.key === 'createdAt' ? new Date(bValue) : Number(bValue);
      }

      if (aValue < bValue) {
        return planSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return planSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [plans, planFilters, planSortConfig]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentProductPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentProductPage, itemsPerPage]);

  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPlanPage - 1) * itemsPerPage;
    return filteredAndSortedPlans.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPlans, currentPlanPage, itemsPerPage]);

  const productTotalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const planTotalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);

  // Modal handlers
  const handleCreateProduct = () => {
    setIsCreateProductModalOpen(true);
  };

  const handleCreatePlan = () => {
    setIsCreatePlanModalOpen(true);
  };

  const handleEditProduct = (product) => {
    if (!hasPermission('edit')) {
      setError('You do not have permission to edit products');
      return;
    }
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    if (!hasPermission('edit')) {
      setError('You do not have permission to edit plans');
      return;
    }
    setEditingPlan(plan);
    setIsEditPlanModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateProductModalOpen(false);
    setIsCreatePlanModalOpen(false);
    setIsEditProductModalOpen(false);
    setIsEditPlanModalOpen(false);
    setEditingProduct(null);
    setEditingPlan(null);
  };

  const handleProductSaved = (message) => {
    setSuccessMessage(message);
    fetchProducts();
    handleCloseModals();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePlanSaved = (message) => {
    setSuccessMessage(message);
    fetchSubscriptionPlans();
    handleCloseModals();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Product actions
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

  const togglePlanStatus = async (planId, currentStatus) => {
    if (!hasPermission('toggle')) {
      setError('You do not have permission to change plan status');
      return;
    }

    try {
      setLoading(true);
      await subscriptionPlanAPI.updatePlan(planId, { isActive: !currentStatus });
      setSuccessMessage(`Plan ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchSubscriptionPlans();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update plan status:', err);
      setError('Failed to update plan status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlanPopular = async (planId, currentStatus) => {
    try {
      setLoading(true);
      await subscriptionPlanAPI.togglePlanPopular(planId, currentStatus);
      setSuccessMessage(`Plan ${!currentStatus ? 'added to' : 'removed from'} popular successfully!`);
      fetchSubscriptionPlans();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update popular status:', err);
      setError('Failed to update popular status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
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

  const handleDeletePlan = async (planId) => {
    if (!hasPermission('delete')) {
      setError('You do not have permission to delete plans');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this subscription plan? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      await subscriptionPlanAPI.deletePlan(planId);
      setSuccessMessage('Subscription plan deleted successfully!');
      fetchSubscriptionPlans();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete plan:', err);
      setError('Failed to delete subscription plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (productId, file) => {
    if (!file) {
      setError('Please select an image file first');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      await productAPI.uploadProductPhoto(productId, formData);
      setSuccessMessage('Product photo uploaded successfully!');
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setError('Failed to upload product photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Role-based permission system
  const hasPermission = (action) => {
    const permissions = {
      admin: ['create', 'edit', 'delete', 'toggle', 'view', 'upload'],
      manager: ['create', 'edit', 'toggle', 'view', 'upload'],
      editor: ['edit', 'view', 'upload'],
      viewer: ['view']
    };

    return permissions[userRole]?.includes(action) || false;
  };

  // Filter handlers
  const handleProductFilterChange = (filterType, value) => {
    setProductFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentProductPage(1);
  };

  const handlePlanFilterChange = (filterType, value) => {
    setPlanFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPlanPage(1);
  };

  const clearProductFilters = () => {
    setProductFilters({
      category: '',
      status: '',
      stock: '',
      search: '',
    });
    setCurrentProductPage(1);
  };

  const clearPlanFilters = () => {
    setPlanFilters({
      type: '',
      status: '',
      popular: '',
      search: '',
    });
    setCurrentPlanPage(1);
  };

  // Sort handlers
  const handleProductSort = (key) => {
    setProductSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePlanSort = (key) => {
    setPlanSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination handlers
  const goToProductPage = (page) => {
    setCurrentProductPage(page);
  };

  const goToPlanPage = (page) => {
    setCurrentPlanPage(page);
  };

  // Calculate metrics
  const productMetrics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    
    return { totalProducts, activeProducts, lowStockProducts, outOfStockProducts };
  }, [products]);

  const planMetrics = useMemo(() => {
    const totalPlans = plans.length;
    const activePlans = plans.filter(p => p.isActive).length;
    const popularPlans = plans.filter(p => p.isPopular).length;
    const presetPlans = plans.filter(p => p.type === 'preset').length;
    
    return { totalPlans, activePlans, popularPlans, presetPlans };
  }, [plans]);

  // Export functionality
  const exportData = () => {
    const data = activeTab === 'products' 
      ? filteredAndSortedProducts.map(product => ({
          Name: product.name,
          Description: product.description,
          Price: product.price,
          Category: product.category,
          Stock: product.stock,
          Status: product.isActive ? 'Active' : 'Inactive',
          'Created Date': new Date(product.createdAt).toLocaleDateString()
        }))
      : filteredAndSortedPlans.map(plan => ({
          Name: plan.name,
          Type: plan.type,
          'Base Size': plan.baseSize,
          'Base Price': plan.basePrice,
          'Price per Kg': plan.pricePerKg,
          Status: plan.isActive ? 'Active' : 'Inactive',
          Popular: plan.isPopular ? 'Yes' : 'No',
          'Created Date': new Date(plan.createdAt).toLocaleDateString()
        }));

    if (data.length === 0) {
      setError('No data to export');
      return;
    }

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="apm-admin-container">
      <header className="apm-admin-header">
        <div className="apm-header-content">
          <div>
            <h1>Product & Subscription Management</h1>
            <p>Manage products and subscription plans in your store</p>
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
            
            <button onClick={exportData} className="apm-btn-export">
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

      {/* Tab Navigation */}
      <div className="apm-tab-navigation">
        <button 
          className={`apm-tab ${activeTab === 'products' ? 'apm-tab-active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FaGasPump className="apm-icon" /> Products ({productMetrics.totalProducts})
        </button>
        <button 
          className={`apm-tab ${activeTab === 'plans' ? 'apm-tab-active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <FaCalendarAlt className="apm-icon" /> Subscription Plans ({planMetrics.totalPlans})
        </button>
      </div>

      {/* Metrics */}
      <div className="apm-metrics-grid">
        {activeTab === 'products' ? (
          <>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{productMetrics.totalProducts}</div>
              <div className="apm-metric-label">Total Products</div>
            </div>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{productMetrics.activeProducts}</div>
              <div className="apm-metric-label">Active Products</div>
            </div>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{productMetrics.lowStockProducts}</div>
              <div className="apm-metric-label">Low Stock</div>
            </div>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{productMetrics.outOfStockProducts}</div>
              <div className="apm-metric-label">Out of Stock</div>
            </div>
          </>
        ) : (
          <>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{planMetrics.totalPlans}</div>
              <div className="apm-metric-label">Total Plans</div>
            </div>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{planMetrics.activePlans}</div>
              <div className="apm-metric-label">Active Plans</div>
            </div>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{planMetrics.popularPlans}</div>
              <div className="apm-metric-label">Popular Plans</div>
            </div>
            <div className="apm-metric-card">
              <div className="apm-metric-value">{planMetrics.presetPlans}</div>
              <div className="apm-metric-label">Preset Plans</div>
            </div>
          </>
        )}
      </div>

      <div className="apm-admin-content">
        {/* Filters Section */}
        <div className="apm-filters-section">
          <div className="apm-filters-header">
            <h3>Filters & Search</h3>
            <button 
              onClick={activeTab === 'products' ? clearProductFilters : clearPlanFilters} 
              className="apm-btn-clear-filters"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="apm-filters-grid">
            {activeTab === 'products' ? (
              <>
                <div className="apm-filter-group">
                  <label>Search Products</label>
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={productFilters.search}
                    onChange={(e) => handleProductFilterChange('search', e.target.value)}
                    className="apm-search-input"
                  />
                </div>

                <div className="apm-filter-group">
                  <label>Category</label>
                  <select
                    value={productFilters.category}
                    onChange={(e) => handleProductFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="gas">Gas</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>

                <div className="apm-filter-group">
                  <label>Status</label>
                  <select
                    value={productFilters.status}
                    onChange={(e) => handleProductFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="apm-filter-group">
                  <label>Stock Level</label>
                  <select
                    value={productFilters.stock}
                    onChange={(e) => handleProductFilterChange('stock', e.target.value)}
                  >
                    <option value="">All Stock</option>
                    <option value="inStock">In Stock</option>
                    <option value="lowStock">Low Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="apm-filter-group">
                  <label>Search Plans</label>
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={planFilters.search}
                    onChange={(e) => handlePlanFilterChange('search', e.target.value)}
                    className="apm-search-input"
                  />
                </div>

                <div className="apm-filter-group">
                  <label>Plan Type</label>
                  <select
                    value={planFilters.type}
                    onChange={(e) => handlePlanFilterChange('type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="preset">Preset</option>
                    <option value="custom">Custom</option>
                    <option value="one-time">One-Time</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div className="apm-filter-group">
                  <label>Status</label>
                  <select
                    value={planFilters.status}
                    onChange={(e) => handlePlanFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="apm-filter-group">
                  <label>Popular</label>
                  <select
                    value={planFilters.popular}
                    onChange={(e) => handlePlanFilterChange('popular', e.target.value)}
                  >
                    <option value="">All Plans</option>
                    <option value="popular">Popular Only</option>
                    <option value="notPopular">Not Popular</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Section */}
        {activeTab === 'products' ? (
          <ProductsManagement
            products={filteredAndSortedProducts}
            loading={loading}
            error={error}
            successMessage={successMessage}
            onRefresh={fetchProducts}
            onEdit={handleEditProduct}
            onCreate={handleCreateProduct}
            onDelete={handleDeleteProduct}
            onToggleStatus={toggleProductStatus}
            onToggleFeatured={() => {}}
            onUploadPhoto={handleUploadPhoto}
            hasPermission={hasPermission}
            filters={productFilters}
            onFilterChange={handleProductFilterChange}
            sortConfig={productSortConfig}
            onSort={handleProductSort}
            paginatedProducts={paginatedProducts}
            totalPages={productTotalPages}
            currentPage={currentProductPage}
            onPageChange={goToProductPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        ) : (
          <SubscriptionPlansManagement
            plans={filteredAndSortedPlans}
            loading={loading}
            error={error}
            successMessage={successMessage}
            onRefresh={fetchSubscriptionPlans}
            onEdit={handleEditPlan}
            onCreate={handleCreatePlan}
            onDelete={handleDeletePlan}
            onToggleStatus={togglePlanStatus}
            onTogglePopular={togglePlanPopular}
            hasPermission={hasPermission}
            filters={planFilters}
            onFilterChange={handlePlanFilterChange}
            sortConfig={planSortConfig}
            onSort={handlePlanSort}
            paginatedPlans={paginatedPlans}
            totalPages={planTotalPages}
            currentPage={currentPlanPage}
            onPageChange={goToPlanPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {/* Product Form Modals */}
      {isCreateProductModalOpen && (
        <ProductFormModal
          isOpen={isCreateProductModalOpen}
          onClose={handleCloseModals}
          onSave={handleProductSaved}
          onError={handleError}
          mode="create"
        />
      )}

      {isEditProductModalOpen && editingProduct && (
        <ProductFormModal
          isOpen={isEditProductModalOpen}
          onClose={handleCloseModals}
          onSave={handleProductSaved}
          onError={handleError}
          mode="edit"
          product={editingProduct}
        />
      )}

      {/* Subscription Plan Form Modals */}
      {isCreatePlanModalOpen && (
        <SubscriptionPlanFormModal
          isOpen={isCreatePlanModalOpen}
          onClose={handleCloseModals}
          onSave={handlePlanSaved}
          onError={handleError}
          mode="create"
        />
      )}

      {isEditPlanModalOpen && editingPlan && (
        <SubscriptionPlanFormModal
          isOpen={isEditPlanModalOpen}
          onClose={handleCloseModals}
          onSave={handlePlanSaved}
          onError={handleError}
          mode="edit"
          plan={editingPlan}
        />
      )}
    </div>
  );
};

export default AdminProductManagement;