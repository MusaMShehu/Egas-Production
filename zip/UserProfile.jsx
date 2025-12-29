import React, { useState, useEffect, useCallback } from "react";
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
  FaNewspaper,
  FaEye,
  FaTrash,
  FaExpand
} from "react-icons/fa";
import "./UserProfile.css";
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

// Default avatar image
const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

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
    profileImage: null,
    memberSince: "",
    createdAt: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    deliveryNotifications: true,
    promotionalOffers: true,
    newsletter: false,
  });

  const API_BASE_URL = "https://egas-server-1.onrender.com";

  // ✅ Get profile picture URL with fallback
  const getProfilePicUrl = useCallback(() => {
    console.log("Getting profile pic URL, user.profileImage:", user.profileImage);
    
    if (!user.profileImage) {
      console.log("No profileImage data, using default");
      return DEFAULT_AVATAR;
    }
    
    // Try different possible properties from Cloudinary
    let imageUrl = "";
    
    if (user.profileImage.secure_url) {
      imageUrl = user.profileImage.secure_url;
    } else if (user.profileImage.url) {
      imageUrl = user.profileImage.url;
    } else if (user.profileImage.path) { // From multer-storage-cloudinary
      imageUrl = user.profileImage.path;
    } else if (typeof user.profileImage === 'string') {
      imageUrl = user.profileImage;
    }
    
    console.log("Extracted image URL:", imageUrl);
    
    if (!imageUrl || imageUrl === "" || imageUrl === "default.jpg") {
      console.log("Invalid or empty image URL, using default");
      return DEFAULT_AVATAR;
    }
    
    // Ensure URL is properly formatted
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
      console.log("Image URL is not absolute, might be relative path:", imageUrl);
      // Try to construct absolute URL
      if (imageUrl.startsWith('/')) {
        imageUrl = `${API_BASE_URL}${imageUrl}`;
      } else {
        imageUrl = `${API_BASE_URL}/${imageUrl}`;
      }
      console.log("Converted to absolute URL:", imageUrl);
    }
    
    // Add cache busting for Cloudinary URLs
    if (imageUrl.includes('cloudinary.com')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}t=${Date.now()}`;
    }
    
    return imageUrl;
  }, [user.profileImage]);

  // ✅ Handle image load error
  const handleImageError = useCallback((e) => {
    console.error("Profile image failed to load:", e.target.src);
    console.log("Current user profileImage state:", user.profileImage);
    e.target.src = DEFAULT_AVATAR;
    warningToast("Profile image failed to load");
  }, [user.profileImage]);

  // ✅ Handle image load success
  const handleImageLoad = useCallback(() => {
    console.log("Profile image loaded successfully");
  }, []);

  // ✅ Format member since date
  const formatMemberSince = useCallback(() => {
    const dateString = user.createdAt || user.memberSince;
    
    if (!dateString) {
      return "Member since 2023";
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Member since 2023";
      }
      
      return `Member since ${date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`;
    } catch (error) {
      return "Member since 2023";
    }
  }, [user.createdAt, user.memberSince]);

  // ✅ Format date for input field
  const formatDateForInput = useCallback((dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch (error) {
      return "";
    }
  }, []);

  // ✅ Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");
      infoToast("Loading your profile information...");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Full API response:", result);

        if (result.success && result.user) {
          const userData = result.user;
          console.log("User data from API:", userData);
          console.log("Profile image data:", userData.profileImage);
          
          // Handle profileImage data structure from Cloudinary backend
          let profileImageData = null;
          
          if (userData.profileImage) {
            console.log("Raw profileImage data:", userData.profileImage);
            
            if (typeof userData.profileImage === 'object') {
              // Check for different Cloudinary response structures
              if (userData.profileImage.secure_url || userData.profileImage.url) {
                profileImageData = {
                  url: userData.profileImage.url || "",
                  secure_url: userData.profileImage.secure_url || userData.profileImage.url || "",
                  public_id: userData.profileImage.public_id || ""
                };
              } else if (userData.profileImage.path) {
                // From multer-storage-cloudinary
                profileImageData = {
                  url: userData.profileImage.path || "",
                  secure_url: userData.profileImage.path || "",
                  public_id: userData.profileImage.filename || userData.profileImage.public_id || ""
                };
              }
            } else if (typeof userData.profileImage === 'string') {
              // String URL
              profileImageData = {
                url: userData.profileImage,
                secure_url: userData.profileImage,
                public_id: `user_${userData._id}_profile`
              };
            }
          }

          console.log("Processed profileImageData:", profileImageData);

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
            profileImage: profileImageData,
            memberSince: userData.createdAt || userData.memberSince || "",
            createdAt: userData.createdAt || "",
          };

          console.log("Setting user state with:", userProfileData);
          setUser(userProfileData);

          if (userData.notificationPreferences) {
            setNotificationPrefs(userData.notificationPreferences);
          }

          // Store in localStorage
          localStorage.setItem("user", JSON.stringify({
            ...userData,
            id: userData._id || userData.id,
            profileImage: profileImageData,
            createdAt: userData.createdAt
          }));

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

  // ✅ Upload profile image - CORRECTED to match backend
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
      warningToast("Please select a file to upload.");
      return;
    }

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      warningToast("Please select a valid image file (JPEG, PNG, GIF, WEBP).");
      return;
    }

    if (file.size > maxSize) {
      warningToast("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setError("");
    infoToast("Uploading profile picture to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("profileImage", file); // Field name matches backend middleware

      console.log("Uploading file to Cloudinary...");

      // Use the Cloudinary upload endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/users/upload-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload response:", result);

      // Handle Cloudinary response structure
      let imageUrl = "";
      let publicId = "";

      // Try different response structures
      if (result.imageUrl) {
        imageUrl = result.imageUrl;
      } else if (result.secure_url) {
        imageUrl = result.secure_url;
      } else if (result.url) {
        imageUrl = result.url;
      } else if (result.data?.secure_url) {
        imageUrl = result.data.secure_url;
        publicId = result.data.public_id;
      } else if (result.data?.url) {
        imageUrl = result.data.url;
        publicId = result.data.public_id;
      }

      if (!imageUrl) {
        console.error("No image URL in response:", result);
        throw new Error("No image URL received from server");
      }

      console.log("Uploaded image URL:", imageUrl);

      // Update user state with new Cloudinary image data
      const updatedProfileImage = {
        url: imageUrl,
        secure_url: imageUrl,
        public_id: publicId || `upload_${Date.now()}`
      };
      
      setUser(prev => ({
        ...prev,
        profileImage: updatedProfileImage
      }));

      console.log("Updated user state with:", updatedProfileImage);

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        profileImage: updatedProfileImage
      }));

      successToast("Profile picture uploaded successfully!");

    } catch (error) {
      console.error("Error uploading image:", error);
      errorToast(error.message || "Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Clear input
    }
  };

  // ✅ Delete profile image
  const handleDeleteImage = async () => {
    if (!user.profileImage) {
      warningToast("No profile image to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your profile picture?")) {
      return;
    }

    setIsLoading(true);
    setError("");
    infoToast("Deleting profile picture...");

    try {
      const token = localStorage.getItem("token");
      
      // Call backend to delete from Cloudinary
      const response = await fetch(`${API_BASE_URL}/api/v1/users/upload-profile/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          public_id: user.profileImage.public_id 
        }),
      });

      if (response.ok) {
        // Reset image data
        setUser(prev => ({
          ...prev,
          profileImage: null
        }));
        
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...storedUser,
          profileImage: null
        }));

        successToast("Profile picture deleted successfully!");
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      errorToast("Failed to delete profile picture. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Toggle view mode
  const toggleViewMode = () => {
    setViewMode(!viewMode);
    setIsEditing(false);
    if (!viewMode) {
      infoToast("View mode enabled. Click Edit to make changes.");
    }
  };

  // ✅ Open image modal for full view
  const openImageModal = () => {
    if (user.profileImage) {
      setShowImageModal(true);
    }
  };

  // ✅ Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // ✅ Handle save profile
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      infoToast("Saving profile changes...");

      const token = localStorage.getItem("token");
      
      // Prepare profile data for update (excluding profileImage as it's handled separately)
      const profileUpdateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        city: user.city,
        state: user.state,
        gpsCoordinates: user.gpsCoordinates,
        notificationPreferences: notificationPrefs
      };

      // Update profile data
      const profileResponse = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileUpdateData),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      successToast("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      errorToast(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setViewMode(false);
    infoToast("Edit mode enabled. Make your changes and click Save.");
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    
    // Reload original data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser) {
      setUser(prev => ({
        ...prev,
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        dob: storedUser.dob || "",
        gender: storedUser.gender || "",
        address: storedUser.address || "",
        city: storedUser.city || "",
        state: storedUser.state || "",
        profileImage: storedUser.profileImage || null
      }));
    }
    
    warningToast("Edit cancelled. Changes were not saved.");
  };

  const handleClearError = () => {
    setError("");
    infoToast("Error message cleared");
  };

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
          errorToast("Failed to get current location. Please enable location services.");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      warningToast("Geolocation is not supported by this browser.");
    }
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

  if (isLoading && !isEditing && !viewMode) {
    return (
      <div className="prof-profile-page loading">
        <div className="prof-loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const profilePicUrl = getProfilePicUrl();
  console.log("Rendering with profilePicUrl:", profilePicUrl);

  return (
    <div className="prof-profile-page">
      {/* Image Modal for Full View */}
      {showImageModal && user.profileImage && (
        <div className="prof-image-modal-overlay" onClick={closeImageModal}>
          <div className="prof-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="prof-image-modal-header">
              <h3>Profile Image</h3>
              <button className="prof-modal-close" onClick={closeImageModal}>
                <FaTimes />
              </button>
            </div>
            <div className="prof-image-modal-body">
              <img
                src={profilePicUrl}
                alt="Profile Full View"
                className="prof-image-full-view"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>
            <div className="prof-image-modal-footer">
              <p>Click outside to close</p>
            </div>
          </div>
        </div>
      )}

      <div className="prof-dashboard-header">
        <h1>Profile Management</h1>
        <div className="prof-header-actions">
          <button
            className={`prof-btn-secondary ${viewMode ? 'active' : ''}`}
            onClick={toggleViewMode}
            disabled={isLoading || isEditing || isUploading}
          >
            <FaEye className="prof-btn-icon" />
            {viewMode ? "Exit View" : "View Profile"}
          </button>
          
          {!isEditing && !viewMode ? (
            <button
              className="prof-btn-primary"
              onClick={handleEditStart}
              disabled={isLoading || isUploading}
            >
              <FaEdit className="prof-btn-icon" />
              Edit Profile
            </button>
          ) : null}
          
          {isEditing && !viewMode ? (
            <div className="prof-edit-actions">
              <button
                className="prof-btn-secondary"
                onClick={handleEditCancel}
                disabled={isLoading || isUploading}
              >
                Cancel
              </button>
              <button
                className="prof-btn-primary"
                onClick={handleSave}
                disabled={isLoading || isUploading}
              >
                <FaSave className="prof-btn-icon" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="prof-error-message">
          <FaInfoCircle className="prof-error-icon" />
          <span>{error}</span>
          <button onClick={handleClearError} className="prof-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="prof-profile-content">
        <div className="prof-profile-card">
          <div className="prof-profile-header">
            <div className="prof-profile-image">
              <div className="prof-image-container">
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className={`prof-profile-img ${viewMode ? 'prof-view-mode-img' : ''}`}
                  onClick={viewMode ? openImageModal : undefined}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                
                {viewMode && user.profileImage && (
                  <div className="prof-view-image-overlay" onClick={openImageModal}>
                    <FaExpand className="prof-expand-icon" />
                    <span>View Full Image</span>
                  </div>
                )}
                
                {(isUploading || isLoading) && (
                  <div className="prof-image-loading">
                    <div className="prof-loading-spinner-small"></div>
                    <span>{isUploading ? "Uploading..." : "Loading..."}</span>
                  </div>
                )}
              </div>
              
              {isEditing && !viewMode && (
                <div className="prof-image-upload-container">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="prof-image-upload-input"
                    disabled={isLoading || isUploading}
                  />
                  <div className="prof-image-actions">
                    <label htmlFor="profileImage" className="prof-edit-image-btn">
                      <FaCamera className="prof-btn-icon" />
                      {isUploading ? "Uploading..." : "Change Photo"}
                    </label>
                    
                    {user.profileImage && (
                      <button
                        className="prof-delete-image-btn"
                        onClick={handleDeleteImage}
                        disabled={isLoading || isUploading}
                      >
                        <FaTrash className="prof-btn-icon" />
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="prof-upload-hint">
                    Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB)
                  </div>
                </div>
              )}
              
              {viewMode && user.profileImage && (
                <div className="prof-view-image-info">
                  <p>Click image to view full size</p>
                </div>
              )}
            </div>
            
            <div className="prof-profile-info">
              <h2>
                <FaUser className="prof-title-icon" />
                {user.firstName || "User"} {user.lastName || ""}
              </h2>
              <p className="prof-member-since">{formatMemberSince()}</p>
              
              {viewMode && (
                <div className="prof-view-details">
                  <p><FaEnvelope className="prof-view-icon" /> {user.email || "Not set"}</p>
                  <p><FaPhone className="prof-view-icon" /> {user.phone || "Not set"}</p>
                </div>
              )}
              
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
                {isEditing && !viewMode ? (
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="Enter first name"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.firstName || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaUser className="prof-field-icon" />
                  Last Name
                </label>
                {isEditing && !viewMode ? (
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="Enter last name"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.lastName || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaEnvelope className="prof-field-icon" />
                  Email
                </label>
                {isEditing && !viewMode ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="Enter email address"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.email || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaPhone className="prof-field-icon" />
                  Phone
                </label>
                {isEditing && !viewMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.phone || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaCalendar className="prof-field-icon" />
                  Date of Birth
                </label>
                {isEditing && !viewMode ? (
                  <input
                    type="date"
                    name="dob"
                    value={formatDateForInput(user.dob)}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaVenusMars className="prof-field-icon" />
                  Gender
                </label>
                {isEditing && !viewMode ? (
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.gender || "Not set"}
                  </span>
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
                {isEditing && !viewMode ? (
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="Street address"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.address || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaMapPin className="prof-field-icon" />
                  City
                </label>
                {isEditing && !viewMode ? (
                  <input
                    type="text"
                    name="city"
                    value={user.city}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="City"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.city || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item">
                <label>
                  <FaMapPin className="prof-field-icon" />
                  State
                </label>
                {isEditing && !viewMode ? (
                  <input
                    type="text"
                    name="state"
                    value={user.state}
                    onChange={handleInputChange}
                    disabled={isLoading || isUploading}
                    placeholder="State"
                  />
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
                    {user.state || "Not set"}
                  </span>
                )}
              </div>
              <div className="prof-detail-item-full">
                <label>
                  <FaMapMarkerAlt className="prof-field-icon" />
                  GPS Coordinates
                </label>
                {isEditing && !viewMode ? (
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
                      disabled={isLoading || isUploading}
                      placeholder="Latitude, Longitude"
                    />
                    <button
                      type="button"
                      className="prof-btn-secondary"
                      onClick={getCurrentLocation}
                      disabled={isLoading || isUploading}
                    >
                      <FaMapMarkerAlt className="prof-btn-icon" />
                      Get Current Location
                    </button>
                  </div>
                ) : (
                  <span className={viewMode ? "prof-view-text" : ""}>
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
                disabled={viewMode || (!isEditing && !viewMode) || isLoading || isUploading}
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
                disabled={viewMode || (!isEditing && !viewMode) || isLoading || isUploading}
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
                disabled={viewMode || (!isEditing && !viewMode) || isLoading || isUploading}
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
                disabled={viewMode || (!isEditing && !viewMode) || isLoading || isUploading}
              />
              <span className="prof-checkmark"></span>
              <FaNewspaper className="prof-pref-icon" />
              Newsletter
            </label>
          </div>

          {isEditing && !viewMode && (
            <div className="prof-preferences-note">
              <p>
                <FaInfoCircle className="prof-info-icon" />
                Notification preferences will be saved when you click "Save Changes"
              </p>
            </div>
          )}
          
          {viewMode && (
            <div className="prof-view-mode-note">
              <p>
                <FaInfoCircle className="prof-info-icon" />
                View mode enabled. Click "Edit Profile" to make changes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;