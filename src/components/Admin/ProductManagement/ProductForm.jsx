// components/ProductFormModal.js
import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaSpinner, 
  FaSave, 
  FaPlus,
  FaUpload
} from 'react-icons/fa';
import { productAPI } from '../../../api/ProductApi';
import './ProductForm.css';

const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onError, 
  mode = 'create', 
  product = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'gas',
    stock: '',
    isActive: true,
    shortDescription: '',
    costPrice: '',
    salePrice: '',
    isOnSale: false,
    sku: '',
    brand: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    seoUrl: '',
    weight: { value: '', unit: 'kg' },
    dimensions: { length: '', width: '', height: '', unit: 'cm' },
    lowStockThreshold: 10
  });

  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form when modal opens or product changes
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category || 'gas',
        stock: product.stock.toString(),
        isActive: product.isActive,
        shortDescription: product.shortDescription || '',
        costPrice: product.costPrice?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        isOnSale: product.isOnSale || false,
        sku: product.sku || '',
        brand: product.brand || '',
        tags: product.tags?.join(', ') || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        seoUrl: product.seoUrl || '',
        weight: product.weight || { value: '', unit: 'kg' },
        dimensions: product.dimensions || { length: '', width: '', height: '', unit: 'cm' },
        lowStockThreshold: product.lowStockThreshold || 10
      });
      
      if (product.image && product.image !== 'default-product.jpg') {
        setImagePreview(`/uploads/products/${product.image}`);
      }
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'gas',
        stock: '',
        isActive: true,
        shortDescription: '',
        costPrice: '',
        salePrice: '',
        isOnSale: false,
        sku: '',
        brand: '',
        tags: '',
        metaTitle: '',
        metaDescription: '',
        seoUrl: '',
        weight: { value: '', unit: 'kg' },
        dimensions: { length: '', width: '', height: '', unit: 'cm' },
        lowStockThreshold: 10
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setFormErrors({});
  }, [mode, product, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('weight.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        weight: { ...prev.weight, [field]: value }
      }));
    } else if (name.startsWith('dimensions.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        onError('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      if (file.size > maxSize) {
        onError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      onError(null);
    }
  };

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

    if (formData.shortDescription && formData.shortDescription.length > 200) {
      errors.shortDescription = 'Short description cannot exceed 200 characters';
    }

    if (formData.costPrice && parseFloat(formData.costPrice) < 0) {
      errors.costPrice = 'Cost price cannot be negative';
    }

    if (formData.salePrice && parseFloat(formData.salePrice) < 0) {
      errors.salePrice = 'Sale price cannot be negative';
    }

    if (formData.lowStockThreshold && parseInt(formData.lowStockThreshold) < 0) {
      errors.lowStockThreshold = 'Low stock threshold cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Prepare data according to backend schema
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        isActive: formData.isActive,
        shortDescription: formData.shortDescription.trim(),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        isOnSale: formData.isOnSale,
        sku: formData.sku.trim(),
        brand: formData.brand.trim(),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        seoUrl: formData.seoUrl.trim(),
        weight: formData.weight.value ? {
          value: parseFloat(formData.weight.value),
          unit: formData.weight.unit
        } : undefined,
        dimensions: formData.dimensions.length ? {
          length: parseFloat(formData.dimensions.length),
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height),
          unit: formData.dimensions.unit
        } : undefined,
        lowStockThreshold: parseInt(formData.lowStockThreshold)
      };

      // Remove undefined values
      Object.keys(productData).forEach(key => {
        if (productData[key] === undefined || productData[key] === '') {
          delete productData[key];
        }
      });

      let result;
      if (mode === 'edit' && product) {
        result = await productAPI.updateProduct(product._id, productData);
        onSave('Product updated successfully!');
      } else {
        result = await productAPI.createProduct(productData);
        onSave('Product created successfully!');
        
        // Handle image upload for new product if needed
        if (imageFile && result.data?._id) {
          const formData = new FormData();
          formData.append('file', imageFile);
          await productAPI.uploadProductPhoto(result.data._id, formData);
        }
      }

    } catch (err) {
      console.error('Failed to save product:', err);
      onError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormErrors({});
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="product-form-modal-overlay">
      <div className="product-form-modal">
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Product' : 'Create New Product'}</h2>
          <button onClick={handleClose} className="modal-close-btn">
            <FaTimes className="icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-scrollable">
            {/* Image Upload Section */}
            <div className="form-section">
              <h4>Product Image</h4>
              <div className="image-upload-section">
                <div className="image-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" />
                  ) : (
                    <div className="image-placeholder">
                      <FaUpload className="icon" />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>
                <div className="image-upload-controls">
                  <input
                    type="file"
                    id="product-image"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <label htmlFor="product-image" className="image-upload-btn">
                    <FaUpload className="icon" />
                    Choose Image
                  </label>
                  <small>JPEG, PNG, WebP (Max 5MB)</small>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                  <div className="char-counter">{formData.name.length}/100</div>
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label>SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formData.sku} 
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows="3"
                />
                {formErrors.description && <span className="error-text">{formErrors.description}</span>}
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <textarea 
                  name="shortDescription" 
                  value={formData.shortDescription} 
                  onChange={handleInputChange}
                  rows="2"
                  maxLength={200}
                  placeholder="Brief description (max 200 characters)"
                />
                <div className="char-counter">{formData.shortDescription.length}/200</div>
                {formErrors.shortDescription && <span className="error-text">{formErrors.shortDescription}</span>}
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h4>Pricing</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₦) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                  {formErrors.price && <span className="error-text">{formErrors.price}</span>}
                </div>

                <div className="form-group">
                  <label>Cost Price (₦)</label>
                  <input 
                    type="number" 
                    name="costPrice" 
                    value={formData.costPrice} 
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                  {formErrors.costPrice && <span className="error-text">{formErrors.costPrice}</span>}
                </div>

                <div className="form-group">
                  <label>Sale Price (₦)</label>
                  <input 
                    type="number" 
                    name="salePrice" 
                    value={formData.salePrice} 
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                  {formErrors.salePrice && <span className="error-text">{formErrors.salePrice}</span>}
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="form-section">
              <h4>Inventory</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="gas">Gas</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleInputChange}
                    min="0"
                  />
                  {formErrors.stock && <span className="error-text">{formErrors.stock}</span>}
                </div>

                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input 
                    type="number" 
                    name="lowStockThreshold" 
                    value={formData.lowStockThreshold} 
                    onChange={handleInputChange}
                    min="0"
                  />
                  {formErrors.lowStockThreshold && <span className="error-text">{formErrors.lowStockThreshold}</span>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h4>Additional Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <input 
                    type="text" 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleInputChange}
                    placeholder="Comma separated tags"
                  />
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="form-section">
              <h4>Product Specifications</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Weight</label>
                  <div className="input-with-unit">
                    <input 
                      type="number" 
                      name="weight.value" 
                      value={formData.weight.value} 
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="Value"
                    />
                    <select 
                      name="weight.unit" 
                      value={formData.weight.unit} 
                      onChange={handleInputChange}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Dimensions</label>
                  <div className="dimensions-inputs">
                    <input 
                      type="number" 
                      name="dimensions.length" 
                      value={formData.dimensions.length} 
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="Length"
                    />
                    <input 
                      type="number" 
                      name="dimensions.width" 
                      value={formData.dimensions.width} 
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="Width"
                    />
                    <input 
                      type="number" 
                      name="dimensions.height" 
                      value={formData.dimensions.height} 
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="Height"
                    />
                    <select 
                      name="dimensions.unit" 
                      value={formData.dimensions.unit} 
                      onChange={handleInputChange}
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="form-section">
              <h4>SEO Settings</h4>
              <div className="form-group">
                <label>SEO URL</label>
                <input 
                  type="text" 
                  name="seoUrl" 
                  value={formData.seoUrl} 
                  onChange={handleInputChange}
                  placeholder="Auto-generated from name"
                />
              </div>
              <div className="form-group">
                <label>Meta Title</label>
                <input 
                  type="text" 
                  name="metaTitle" 
                  value={formData.metaTitle} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea 
                  name="metaDescription" 
                  value={formData.metaDescription} 
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
            </div>

            {/* Status */}
            <div className="form-section">
              <h4>Status</h4>
              <div className="form-row">
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={formData.isActive} 
                      onChange={handleInputChange}
                    />
                    <span>Active Product</span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="isOnSale" 
                      checked={formData.isOnSale} 
                      onChange={handleInputChange}
                    />
                    <span>On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="icon spin" />
                  Saving...
                </>
              ) : mode === 'edit' ? (
                <>
                  <FaSave className="icon" />
                  Update Product
                </>
              ) : (
                <>
                  <FaPlus className="icon" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;