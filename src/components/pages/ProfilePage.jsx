// components/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import '../../styles/ProfilePage.css';

const ProfilePage = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile data from backend API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        // Update both local form state and global user state
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          dob: userData.dob || '',
          gender: userData.gender || '',
          address: userData.address || ''
        });
        
        // Update global user state if needed
        setUser(prevUser => ({ ...prevUser, ...userData }));
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [setUser]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Profile update failed with status: ${response.status}`);
      }

      const updatedUserData = await response.json();
      
      // Update global user state
      setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match!');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Password change failed with status: ${response.status}`);
      }

      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setError(error.message || 'Failed to change password. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please select an image under 5MB.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Profile picture upload failed with status: ${response.status}`);
      }

      const { profilePicUrl } = await response.json();
      
      // Update global user state
      setUser(prevUser => ({ ...prevUser, profilePic: profilePicUrl }));
      
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile picture upload error:', error);
      setError('Failed to upload profile picture. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile-picture', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Profile picture removal failed with status: ${response.status}`);
      }

      // Update global user state with default image
      setUser(prevUser => ({ ...prevUser, profilePic: "https://via.placeholder.com/150" }));
      
      setSuccessMessage('Profile picture removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile picture removal error:', error);
      setError('Failed to remove profile picture. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.firstName) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="text-xl font-bold mb-6">My Profile</h2>
        
        {/* Success and Error Messages */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="profile-grid">
          <div className="profile-form">
            <form onSubmit={handleProfileSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    id="dob" 
                    className="form-input"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select 
                    id="gender" 
                    className="form-input"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea 
                  id="address" 
                  rows="3" 
                  className="form-input form-textarea"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
          
          <div className="profile-sidebar">
            <div className="profile-picture-container">
              <h3 className="font-semibold mb-3">Profile Picture</h3>
              <div className="flex flex-col items-center">
                <div className="picture-wrapper">
                  <img src={user.profilePic} alt="Profile" className="profile-picture" />
                  <label htmlFor="profile-upload" className="upload-label">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input 
                    type="file" 
                    id="profile-upload" 
                    className="upload-input"
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                  />
                </div>
                <button 
                  className="remove-picture" 
                  onClick={handleRemoveProfilePicture}
                  disabled={loading}
                >
                  Remove Picture
                </button>
              </div>
            </div>
            
            <div className="password-form">
              <h3 className="font-semibold mb-3">Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    className="password-input"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    className="password-input"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    className="password-input"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="change-password-button"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;