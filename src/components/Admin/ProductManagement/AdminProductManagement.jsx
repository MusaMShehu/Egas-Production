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
    category: '',
    stock: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const [formErrors, setFormErrors] = useState({});

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
      setImageFile(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.description.trim())
      errors.description = 'Product description is required';
    if (!formData.price || isNaN(formData.price))
      errors.price = 'Valid price required';
    if (!formData.stock || isNaN(formData.stock))
      errors.stock = 'Valid stock required';
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
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
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
  };

  const handleEdit = (product) => {
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
    window.scrollTo(0, 0);
  };

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

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
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

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Product Management</h1>
        <p>Add, edit, and manage products in your store</p>
      </header>

      {error && (
        <div className="admin-error-message">{error}</div>
      )}

      {successMessage && (
        <div className="admin-success-message">{successMessage}</div>
      )}

      <div className="admin-content">
        <div className="product-form-section">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}/>
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange}/>
                {formErrors.price && <span className="error-text">{formErrors.price}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange}/>
              {formErrors.description && <span className="error-text">{formErrors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="gas">Gas</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange}/>
                {formErrors.stock && <span className="error-text">{formErrors.stock}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
              </div>

              <div className="form-group checkbox-group">
                <label>Status</label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange}/>
                Active
              </div>
            </div>

            {imageFile && (
              <div className="image-preview">
                <img src={URL.createObjectURL(imageFile)} alt="preview"/>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
              )}
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