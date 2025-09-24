// components/Profile.js
import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    gpsCoordinates: "",
    profilePic: "default.jpg",
    memberSince: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    deliveryNotifications: true,
    promotionalOffers: true,
    newsletter: false,
  });

  const API_BASE_URL = "http://localhost:5000/api/v1/auth";

  // ✅ Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // ✅ Your backend returns: { success, user }
        if (result.success && result.user) {
          setUser({
            firstName: result.user.firstName || "",
            lastName: result.user.lastName || "",
            email: result.user.email || "",
            phone: result.user.phone || "",
            dob: result.user.dob || "",
            gender: result.user.gender || "",
            address: result.user.address || "",
            city: result.user.city || "",
            state: result.user.state || "",
            gpsCoordinates: result.user.gpsCoordinates || "",
            profilePic: result.user.profilePic || "default.jpg",
            memberSince: result.user.createdAt || "",
          });

          // ✅ Set notification preferences if available
          if (result.user.notificationPreferences) {
            setNotificationPrefs(result.user.notificationPreferences);
          }

          // ✅ Sync localStorage to fix "sign in after refresh" issue
          localStorage.setItem("user", JSON.stringify(result.user));
        } else {
          throw new Error(result.message || "Failed to load profile");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          error.message || "Failed to load profile. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({
      ...notificationPrefs,
      [name]: checked
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUser({
            ...user,
            gpsCoordinates: `${latitude}, ${longitude}`
          });
          setIsLoading(false);
          alert('Location captured successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get current location. Please enable location services or enter coordinates manually.');
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Update profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // // Update preferences
      // const prefsResponse = await fetch(`${API_BASE_URL}/profile/preferences`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(notificationPrefs)
      // });

      // if (!prefsResponse.ok) {
      //   throw new Error('Failed to update preferences');
      // }

      // const prefsResult = await prefsResponse.json();
      
      setIsEditing(false);
      setIsLoading(false);
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_BASE_URL}/profile/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        setUser({
          ...user,
          profilePic: result.data.profilePic
        });
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload profile picture. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Member since 2023';
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  if (isLoading && !isEditing) {
    return <div className="profile-page loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="dashboard-header">
        <h1>Profile Management</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button 
              className="btn-primary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-image">
              <img 
                src={user.profilePic || 'default.jpg'} 
                alt="Profile" 
                onError={(e) => {
                  e.target.src = 'default.jpg';
                }}
              />
              {isEditing && (
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                    disabled={isLoading}
                  />
                  <label htmlFor="profileImage" className="edit-image-btn">
                    <i className="fas fa-camera"></i>
                    {isLoading ? 'Uploading...' : 'Change Photo'}
                  </label>
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{user.firstName} {user.lastName}</h2>
              <p>{formatMemberSince(user.memberSince)}</p>
            </div>
          </div>

          <div className="profile-details">
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                ) : (
                  <span>{user.firstName || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                ) : (
                  <span>{user.lastName || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                ) : (
                  <span>{user.email || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span>{user.phone || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={user.dob}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                ) : (
                  <span>{user.dob || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <span>{user.gender || 'Not set'}</span>
                )}
              </div>
            </div>

            <h3>Address Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Street address"
                  />
                ) : (
                  <span>{user.address || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={user.city}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="City"
                  />
                ) : (
                  <span>{user.city || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={user.state}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="State"
                  />
                ) : (
                  <span>{user.state || 'Not set'}</span>
                )}
              </div>
              <div className="detail-item-full">
                <label>GPS Coordinates</label>
                {isEditing ? (
                  <div className="gps-input-container">
                    <input
                      type="text"
                      name="gpsCoordinates"
                      value={user.gpsCoordinates}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Latitude, Longitude"
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={getCurrentLocation}
                      disabled={isLoading}
                    >
                      <i className="fas fa-location-dot"></i>
                      Get Current Location
                    </button>
                  </div>
                ) : (
                  <span>{user.gpsCoordinates || 'Not set'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-card">
          <h3>Notification Preferences</h3>
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="orderUpdates"
                checked={notificationPrefs.orderUpdates}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="checkmark"></span>
              Order Updates
            </label>
          </div>
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="deliveryNotifications"
                checked={notificationPrefs.deliveryNotifications}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="checkmark"></span>
              Delivery Notifications
            </label>
          </div>
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="promotionalOffers"
                checked={notificationPrefs.promotionalOffers}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="checkmark"></span>
              Promotional Offers
            </label>
          </div>
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="newsletter"
                checked={notificationPrefs.newsletter}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="checkmark"></span>
              Newsletter
            </label>
          </div>

          {isEditing && (
            <div className="preferences-note">
              <p><i className="fas fa-info-circle"></i> Notification preferences will be saved when you click "Save Changes"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;