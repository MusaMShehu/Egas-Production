// components/settings/ProfileSettings.js
import React, { useState } from 'react';

const ProfileSettings = ({ settings, onUpdate, saveStatus }) => {
  const [formData, setFormData] = useState({
    firstName: settings.firstName || '',
    lastName: settings.lastName || '',
    email: settings.email || '',
    phone: settings.phone || '',
    position: settings.position || '',
    department: settings.department || '',
    bio: settings.bio || '',
    avatar: settings.avatar || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(settings.avatar || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onUpdate(formData);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="settings-section">
      <h2>Profile Settings</h2>
      <p className="section-description">
        Manage your admin profile information
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="profile-avatar-section">
          <div className="avatar-preview">
            <img
              src={avatarPreview || '/default-avatar.png'}
              alt="Profile Avatar"
              className="avatar-image"
            />
          </div>
          <div className="avatar-upload">
            <label htmlFor="avatarUpload" className="btn-upload">
              <i className="fas fa-camera"></i>
              Change Avatar
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input"
            />
            <p className="upload-help">JPG, PNG or GIF - Max 2MB</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., System Administrator"
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., IT Department"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;