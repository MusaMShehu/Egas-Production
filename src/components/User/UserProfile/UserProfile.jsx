import React, { useState, useEffect } from "react";
import { 
  FaEdit, 
  FaTimes, 
  FaCamera, 
  FaMapMarkerAlt, 
  FaInfoCircle,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaVenusMars,
  FaMapPin,
  FaMapMarkedAlt,
  FaBell,
  FaShoppingBag,
  FaTruck,
  FaTag,
  FaNewspaper
} from "react-icons/fa";
import "./UserProfile.css";
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    gpsCoordinates: { type: "Point", coordinates: [0, 0] },
    profilePic: "default.jpg",
    memberSince: "",
    createdAt: "", // Added createdAt field
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

  const API_BASE_URL = "https://egas-server-1.onrender.com";

  // ✅ Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");
      infoToast("Loading your profile information...");

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched user data:", result); // Debug log

        if (result.success && result.user) {
          const userData = result.user;
          const userProfileData = {
            id: userData._id || userData.id || "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            dob: userData.dob || "",
            gender: userData.gender || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            gpsCoordinates: userData.gpsCoordinates || {
              type: "Point",
              coordinates: [0, 0],
            },
            profilePic: userData.profilePic || "default.jpg",
            memberSince: userData.createdAt || userData.memberSince || "",
            createdAt: userData.createdAt || "", // Store createdAt separately
          };

          setUser(userProfileData);

          if (userData.notificationPreferences) {
            setNotificationPrefs(userData.notificationPreferences);
          }

          // Update localStorage with complete user data
          localStorage.setItem("user", JSON.stringify({
            ...userData,
            id: userData._id || userData.id,
            profilePic: userData.profilePic || "default.jpg",
            createdAt: userData.createdAt
          }));

          console.log("User data set:", userProfileData);
          successToast("Profile loaded successfully!");
        } else {
          throw new Error(result.message || "Failed to load profile");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        const errorMsg = error.message || "Failed to load profile. Please try again later.";
        setError(errorMsg);
        errorToast(errorMsg);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Debug effect to log user state changes
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({
      ...notificationPrefs,
      [name]: checked,
    });
    infoToast(`${name.split(/(?=[A-Z])/).join(' ')} ${checked ? 'enabled' : 'disabled'}`);
  };

  // ✅ Update current location capture
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      infoToast("Getting your current location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUser({
            ...user,
            gpsCoordinates: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          });
          setIsLoading(false);
          successToast("Location captured successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          const errorMsg = "Failed to get current location. Please enable location services.";
          setError(errorMsg);
          errorToast(errorMsg);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      const errorMsg = "Geolocation is not supported by this browser.";
      setError(errorMsg);
      warningToast(errorMsg);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      infoToast("Saving profile changes...");

      const profileResponse = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Refetch user data after successful save to ensure consistency
      const refreshedResponse = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (refreshedResponse.ok) {
        const refreshedResult = await refreshedResponse.json();
        if (refreshedResult.success && refreshedResult.user) {
          const refreshedUser = refreshedResult.user;
          setUser(prev => ({
            ...prev,
            profilePic: refreshedUser.profilePic || prev.profilePic,
            createdAt: refreshedUser.createdAt || prev.createdAt
          }));
          
          localStorage.setItem("user", JSON.stringify(refreshedUser));
        }
      }

      setIsEditing(false);
      setIsLoading(false);
      successToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg = error.message || "Failed to update profile. Please try again.";
      setError(errorMsg);
      errorToast(errorMsg);
      setIsLoading(false);
    }
  };

  // ✅ Fixed handleImageUpload function with proper persistence
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem("token");

    // Get user ID from multiple sources
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || storedUser?._id || storedUser?.id;

    if (!file) {
      const errorMsg = "Please select a file to upload.";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    if (!userId) {
      console.error("User ID not found:", { userId, storedUser, user });
      const errorMsg = "User information not found. Please log in again.";
      setError(errorMsg);
      errorToast(errorMsg);
      return;
    }

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      const errorMsg = "Please select a valid image file (JPEG, PNG, GIF).";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    if (file.size > maxSize) {
      const errorMsg = "Image size must be less than 5MB.";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    setIsLoading(true);
    setError("");
    infoToast("Uploading profile picture...");

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      console.log("Uploading profile picture for user:", userId);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/users/picture/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Upload response:", result);

      // Handle different possible response structures
      const newProfilePic = result.data?.profilePic || 
                           result.profilePic || 
                           result.user?.profilePic || 
                           result.imageUrl;

      if (!newProfilePic) {
        throw new Error("No profile picture URL in response");
      }

      // Ensure we have a full URL if the backend returns a relative path
      let finalProfilePic = newProfilePic;
      if (!newProfilePic.startsWith('http') && !newProfilePic.startsWith('blob:') && newProfilePic !== "default.jpg") {
        finalProfilePic = `${API_BASE_URL}${newProfilePic.startsWith('/') ? '' : '/'}${newProfilePic}`;
      }

      // Update user state with new profile picture
      setUser(prevUser => ({
        ...prevUser,
        profilePic: finalProfilePic
      }));

      // Update localStorage with the new profile picture
      const updatedUser = { 
        ...storedUser, 
        profilePic: finalProfilePic,
        id: userId 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Refetch user data to ensure everything is synchronized
      const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success && refreshResult.user) {
          localStorage.setItem("user", JSON.stringify(refreshResult.user));
        }
      }

      successToast("Profile picture updated successfully!");
      
      // Force refresh by clearing input
      e.target.value = "";

    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg = error.message || "Failed to upload profile picture. Please try again.";
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Improved image URL handling with cache busting
  const getProfilePicUrl = () => {
    if (!user.profilePic || user.profilePic === "default.jpg") {
      return "default.jpg";
    }
    
    // If it's already a full URL, add timestamp for cache busting
    if (user.profilePic.startsWith('http')) {
      return `${user.profilePic}?t=${Date.now()}`;
    }
    
    // If it's a relative path, make it absolute with cache busting
    return `${API_BASE_URL}${user.profilePic.startsWith('/') ? '' : '/'}${user.profilePic}?t=${Date.now()}`;
  };

  // ✅ Fixed member since date formatting
  const formatMemberSince = () => {
    // Try multiple possible date sources in order of priority
    const dateString = user.createdAt || user.memberSince;
    
    if (!dateString) {
      return "Member since 2023";
    }

    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "Member since 2023";
      }
      
      return `Member since ${date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Member since 2023";
    }
  };

  // ✅ Format date for display in form fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date for input:", error);
      return "";
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    infoToast("Edit mode enabled. Make your changes and click Save.");
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    warningToast("Edit cancelled. Changes were not saved.");
  };

  const handleClearError = () => {
    setError("");
    infoToast("Error message cleared");
  };

  const handleGPSManualInput = (e) => {
    const value = e.target.value;
    const [lat, lng] = value.split(",").map((v) => parseFloat(v.trim()));
    
    if (!isNaN(lat) && !isNaN(lng)) {
      setUser({
        ...user,
        gpsCoordinates: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
      infoToast("GPS coordinates updated manually");
    }
  };

  if (isLoading && !isEditing) {
    return <div className="prof-profile-page loading">Loading profile...</div>;
  }

  return (
    <div className="prof-profile-page">
      <div className="prof-dashboard-header">
        <h1>Profile Management</h1>
        <div className="prof-header-actions">
          {!isEditing ? (
            <button
              className="prof-btn-primary"
              onClick={handleEditStart}
              disabled={isLoading}
            >
              <FaEdit className="prof-btn-icon" />
              Edit Profile
            </button>
          ) : (
            <div className="prof-edit-actions">
              <button
                className="prof-btn-secondary"
                onClick={handleEditCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="prof-btn-primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                <FaSave className="prof-btn-icon" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="prof-error-message">
          <FaInfoCircle className="prof-error-icon" />
          {error}
          <button onClick={handleClearError} className="prof-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="prof-profile-content">
        <div className="prof-profile-card">
          <div className="prof-profile-header">
            <div className="prof-profile-image">
              <img
                src={getProfilePicUrl()}
                alt="Profile"
                onError={(e) => {
                  console.error("Image failed to load:", user.profilePic);
                  e.target.src = "default.jpg";
                  warningToast("Profile image failed to load, using default image");
                }}
                onLoad={() => console.log("Image loaded successfully:", user.profilePic)}
              />
              {isEditing && (
                <div className="prof-image-upload-container">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="prof-image-upload-input"
                    disabled={isLoading}
                  />
                  <label htmlFor="profileImage" className="prof-edit-image-btn">
                    <FaCamera className="prof-btn-icon" />
                    {isLoading ? "Uploading..." : "Change Photo"}
                  </label>
                  <div className="prof-upload-hint">
                    Supported formats: JPEG, PNG, GIF (Max 5MB)
                  </div>
                </div>
              )}
            </div>
            <div className="prof-profile-info">
              <h2>
                <FaUser className="prof-title-icon" />
                {user.firstName} {user.lastName}
              </h2>
              <p>{formatMemberSince()}</p>
              {isEditing && (
                <div className="prof-user-id">
                  User ID: {user.id || "Not available"}
                </div>
              )}
            </div>
          </div>

          <div className="prof-profile-details">
            <h3>
              <FaUser className="prof-section-icon" />
              Personal Information
            </h3>
            <div className="prof-detail-grid">
              <div className="prof-detail-item">
                <label>
                  <FaUser className="prof-field-icon" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter first name"
                  />
                ) : (
                  <span>{user.firstName || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaUser className="prof-field-icon" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter last name"
                  />
                ) : (
                  <span>{user.lastName || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaEnvelope className="prof-field-icon" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter email address"
                  />
                ) : (
                  <span>{user.email || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaPhone className="prof-field-icon" />
                  Phone
                </label>
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
                  <span>{user.phone || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaCalendar className="prof-field-icon" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formatDateForInput(user.dob)}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                ) : (
                  <span>{user.dob || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaVenusMars className="prof-field-icon" />
                  Gender
                </label>
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
                  <span>{user.gender || "Not set"}</span>
                )}
              </div>
            </div>

            <h3>
              <FaMapMarkedAlt className="prof-section-icon" />
              Address Information
            </h3>
            <div className="prof-detail-grid">
              <div className="prof-detail-item">
                <label>
                  <FaMapPin className="prof-field-icon" />
                  Street Address
                </label>
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
                  <span>{user.address || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaMapPin className="prof-field-icon" />
                  City
                </label>
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
                  <span>{user.city || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaMapPin className="prof-field-icon" />
                  State
                </label>
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
                  <span>{user.state || "Not set"}</span>
                )}
              </div>
              <div className="prof-detail-item-full">
                <label>
                  <FaMapMarkerAlt className="prof-field-icon" />
                  GPS Coordinates
                </label>
                {isEditing ? (
                  <div className="prof-gps-input-container">
                    <input
                      type="text"
                      name="gpsCoordinates"
                      value={
                        user.gpsCoordinates?.coordinates
                          ? `${user.gpsCoordinates.coordinates[1]}, ${user.gpsCoordinates.coordinates[0]}`
                          : ""
                      }
                      onChange={handleGPSManualInput}
                      disabled={isLoading}
                      placeholder="Latitude, Longitude"
                    />
                    <button
                      type="button"
                      className="prof-btn-secondary"
                      onClick={getCurrentLocation}
                      disabled={isLoading}
                    >
                      <FaMapMarkerAlt className="prof-btn-icon" />
                      Get Current Location
                    </button>
                  </div>
                ) : (
                  <span>
                    {user.gpsCoordinates?.coordinates
                      ? `${user.gpsCoordinates.coordinates[1]}, ${user.gpsCoordinates.coordinates[0]}`
                      : "Not set"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="prof-preferences-card">
          <h3>
            <FaBell className="prof-section-icon" />
            Notification Preferences
          </h3>
          <div className="prof-preference-item">
            <label className="prof-checkbox-label">
              <input
                type="checkbox"
                name="orderUpdates"
                checked={notificationPrefs.orderUpdates}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="prof-checkmark"></span>
              <FaShoppingBag className="prof-pref-icon" />
              Order Updates
            </label>
          </div>
          <div className="prof-preference-item">
            <label className="prof-checkbox-label">
              <input
                type="checkbox"
                name="deliveryNotifications"
                checked={notificationPrefs.deliveryNotifications}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="prof-checkmark"></span>
              <FaTruck className="prof-pref-icon" />
              Delivery Notifications
            </label>
          </div>
          <div className="prof-preference-item">
            <label className="prof-checkbox-label">
              <input
                type="checkbox"
                name="promotionalOffers"
                checked={notificationPrefs.promotionalOffers}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="prof-checkmark"></span>
              <FaTag className="prof-pref-icon" />
              Promotional Offers
            </label>
          </div>
          <div className="prof-preference-item">
            <label className="prof-checkbox-label">
              <input
                type="checkbox"
                name="newsletter"
                checked={notificationPrefs.newsletter}
                onChange={handlePreferenceChange}
                disabled={!isEditing || isLoading}
              />
              <span className="prof-checkmark"></span>
              <FaNewspaper className="prof-pref-icon" />
              Newsletter
            </label>
          </div>

          {isEditing && (
            <div className="prof-preferences-note">
              <p>
                <FaInfoCircle className="prof-info-icon" />
                Notification preferences will be saved when you click "Save Changes"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;