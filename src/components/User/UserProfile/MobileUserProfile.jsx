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
  FaNewspaper,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaHistory,
  FaTags,
  FaBox,
  FaWallet
} from "react-icons/fa";
import "./MobileUserProfile.css";
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const ProfileMobile = () => {
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
    profileImage: {
      url: "",
      public_id: "",
      secure_url: ""
    },
    memberSince: "",
    createdAt: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [activeSection, setActiveSection] = useState("personal"); // personal, address, notifications
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    deliveryNotifications: true,
    promotionalOffers: true,
    newsletter: false,
  });

  const API_BASE_URL = "https://egas-server-1.onrender.com";

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");

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
        console.log("Fetched user data:", result);

        if (result.success && result.user) {
          const userData = result.user;
          
          let profileImageData = {
            url: "",
            public_id: "",
            secure_url: ""
          };
          
          if (userData.profileImage) {
            if (typeof userData.profileImage === 'string') {
              profileImageData.url = userData.profileImage;
              profileImageData.secure_url = userData.profileImage;
            } else if (userData.profileImage.url) {
              profileImageData = {
                url: userData.profileImage.url,
                public_id: userData.profileImage.public_id || "",
                secure_url: userData.profileImage.secure_url || userData.profileImage.url
              };
            }
          }

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

          setUser(userProfileData);
          
          if (profileImageData.secure_url) {
            setImagePreview(profileImageData.secure_url);
          } else if (profileImageData.url) {
            setImagePreview(profileImageData.url);
          }

          if (userData.notificationPreferences) {
            setNotificationPrefs(userData.notificationPreferences);
          }

          localStorage.setItem("user", JSON.stringify({
            ...userData,
            id: userData._id || userData.id,
            profileImage: profileImageData,
            createdAt: userData.createdAt
          }));

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
    infoToast(`${name.replace(/([A-Z])/g, ' $1').toLowerCase()} ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
      warningToast("Please select a file to upload.");
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      warningToast("Please select a valid image file (JPEG, PNG, GIF, WEBP).");
      return;
    }

    if (file.size > maxSize) {
      warningToast("Image size must be less than 5MB.");
      return;
    }

    setIsLoading(true);
    setError("");
    infoToast("Uploading profile picture...");

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(`${API_BASE_URL}/api/v1/users/upload-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload response:", result);

      if (result.success && result.imageUrl) {
        const updatedProfileImage = {
          url: result.imageUrl,
          secure_url: result.imageUrl,
          public_id: result.public_id || ""
        };
        
        setUser(prev => ({
          ...prev,
          profileImage: updatedProfileImage
        }));
        
        setImagePreview(result.imageUrl);

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...storedUser,
          profileImage: updatedProfileImage
        }));

        successToast("Profile picture updated!");
      } else {
        throw new Error(result.message || "Upload failed");
      }

    } catch (error) {
      console.error("Error uploading image:", error);
      errorToast(error.message || "Failed to upload profile picture.");
    } finally {
      setIsLoading(false);
      setShowImageOptions(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (!user.profileImage?.public_id && !user.profileImage?.url) {
      warningToast("No profile image to delete.");
      return;
    }

    if (!window.confirm("Delete your profile picture?")) {
      return;
    }

    setIsLoading(true);
    setError("");
    infoToast("Deleting profile picture...");

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/api/v1/users/upload-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileImage: null }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      const emptyImage = {
        url: "",
        public_id: "",
        secure_url: ""
      };
      
      setUser(prev => ({
        ...prev,
        profileImage: emptyImage
      }));
      
      setImagePreview("");
      
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        profileImage: emptyImage
      }));

      successToast("Profile picture deleted!");
    } catch (error) {
      console.error("Error deleting image:", error);
      errorToast("Failed to delete profile picture.");
    } finally {
      setIsLoading(false);
      setShowImageOptions(false);
    }
  };

  const getProfilePicUrl = () => {
    if (!user.profileImage || (!user.profileImage.url && !user.profileImage.secure_url)) {
      return "default.jpg";
    }
    
    const imageUrl = user.profileImage.secure_url || user.profileImage.url;
    
    if (imageUrl.includes('cloudinary.com')) {
      return `${imageUrl}?t=${Date.now()}`;
    }
    
    return imageUrl;
  };

  const formatMemberSince = () => {
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
        month: "short",
        year: "numeric",
      })}`;
    } catch (error) {
      return "Member since 2023";
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      infoToast("Saving changes...");

      const { profileImage, ...profileData } = user;
      
      const profileResponse = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      const refreshedResponse = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (refreshedResponse.ok) {
        const refreshedResult = await refreshedResponse.json();
        if (refreshedResult.success && refreshedResult.user) {
          setUser(prev => ({
            ...prev,
            ...refreshedResult.user,
            profileImage: prev.profileImage
          }));
          localStorage.setItem("user", JSON.stringify(refreshedResult.user));
        }
      }

      setIsEditing(false);
      setIsLoading(false);
      successToast("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      errorToast(error.message || "Failed to update profile.");
      setIsLoading(false);
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setViewMode(false);
    infoToast("Edit mode enabled");
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    warningToast("Edit cancelled");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      infoToast("Getting location...");
      
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
          successToast("Location captured!");
        },
        (error) => {
          console.error("Error getting location:", error);
          errorToast("Enable location services");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      warningToast("Geolocation not supported");
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="mobile-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mobile-profile-container">
      {/* Header */}
      <div className="mobile-profile-header">
        <button className="mobile-back-btn" onClick={() => window.history.back()}>
          <FaChevronLeft />
        </button>
        <h1>My Profile</h1>
        <div className="mobile-header-actions">
          {!isEditing && !viewMode && (
            <button className="mobile-edit-btn" onClick={handleEditStart} disabled={isLoading}>
              <FaEdit />
            </button>
          )}
          {isEditing && (
            <>
              <button className="mobile-cancel-btn" onClick={handleEditCancel}>
                <FaTimes />
              </button>
              <button className="mobile-save-btn" onClick={handleSave} disabled={isLoading}>
                <FaSave />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Image Section */}
      <div className="mobile-profile-image-section">
        <div className="mobile-profile-image-wrapper">
          <img
            src={getProfilePicUrl()}
            alt="Profile"
            className="mobile-profile-img"
            onError={(e) => {
              e.target.src = "default.jpg";
            }}
          />
          {isEditing && (
            <button 
              className="mobile-change-photo-btn"
              onClick={() => setShowImageOptions(!showImageOptions)}
            >
              <FaCamera />
            </button>
          )}
        </div>
        
        {showImageOptions && isEditing && (
          <div className="mobile-image-options">
            <label className="mobile-option-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mobile-file-input"
                disabled={isLoading}
              />
              <FaCamera />
              <span>Upload Photo</span>
            </label>
            {user.profileImage?.url && (
              <button 
                className="mobile-option-btn delete"
                onClick={handleDeleteImage}
                disabled={isLoading}
              >
                <FaTrash />
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        )}

        <div className="mobile-user-info">
          <h2>{user.firstName} {user.lastName}</h2>
          <p className="mobile-user-email">{user.email}</p>
          <p className="mobile-member-since">{formatMemberSince()}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mobile-section-tabs">
        <button 
          className={`mobile-tab ${activeSection === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveSection('personal')}
        >
          <FaUser />
          <span>Personal</span>
        </button>
        <button 
          className={`mobile-tab ${activeSection === 'address' ? 'active' : ''}`}
          onClick={() => setActiveSection('address')}
        >
          <FaMapMarkedAlt />
          <span>Address</span>
        </button>
        <button 
          className={`mobile-tab ${activeSection === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveSection('notifications')}
        >
          <FaBell />
          <span>Notifications</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="mobile-profile-content">
        {activeSection === 'personal' && (
          <div className="mobile-section-content">
            <div className="mobile-form-group">
              <label>
                <FaUser />
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.firstName || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaUser />
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.lastName || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaEnvelope />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.email || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaPhone />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.phone || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaCalendar />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""}
                  onChange={handleInputChange}
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
                </p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaVenusMars />
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleInputChange}
                  className="mobile-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              ) : (
                <p className="mobile-info-text">{user.gender || "Not set"}</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'address' && (
          <div className="mobile-section-content">
            <div className="mobile-form-group">
              <label>
                <FaMapPin />
                Street Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.address || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaMapPin />
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={user.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.city || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaMapPin />
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={user.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="mobile-input"
                />
              ) : (
                <p className="mobile-info-text">{user.state || "Not set"}</p>
              )}
            </div>

            <div className="mobile-form-group">
              <label>
                <FaMapMarkerAlt />
                GPS Coordinates
              </label>
              {isEditing ? (
                <div className="mobile-gps-section">
                  <input
                    type="text"
                    value={
                      user.gpsCoordinates?.coordinates
                        ? `${user.gpsCoordinates.coordinates[1]}, ${user.gpsCoordinates.coordinates[0]}`
                        : ""
                    }
                    onChange={(e) => {
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
                      }
                    }}
                    placeholder="Latitude, Longitude"
                    className="mobile-input"
                  />
                  <button
                    className="mobile-location-btn"
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                  >
                    <FaMapMarkerAlt />
                    Get Current Location
                  </button>
                </div>
              ) : (
                <p className="mobile-info-text">
                  {user.gpsCoordinates?.coordinates
                    ? `${user.gpsCoordinates.coordinates[1]}, ${user.gpsCoordinates.coordinates[0]}`
                    : "Not set"}
                </p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="mobile-section-content">
            <div className="mobile-notification-item">
              <div className="notification-info">
                <FaShoppingBag />
                <div>
                  <h4>Order Updates</h4>
                  <p>Updates about your orders</p>
                </div>
              </div>
              <label className="mobile-switch">
                <input
                  type="checkbox"
                  checked={notificationPrefs.orderUpdates}
                  onChange={handlePreferenceChange}
                  name="orderUpdates"
                  disabled={!isEditing}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="mobile-notification-item">
              <div className="notification-info">
                <FaTruck />
                <div>
                  <h4>Delivery Notifications</h4>
                  <p>Delivery status updates</p>
                </div>
              </div>
              <label className="mobile-switch">
                <input
                  type="checkbox"
                  checked={notificationPrefs.deliveryNotifications}
                  onChange={handlePreferenceChange}
                  name="deliveryNotifications"
                  disabled={!isEditing}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="mobile-notification-item">
              <div className="notification-info">
                <FaTag />
                <div>
                  <h4>Promotional Offers</h4>
                  <p>Special deals and discounts</p>
                </div>
              </div>
              <label className="mobile-switch">
                <input
                  type="checkbox"
                  checked={notificationPrefs.promotionalOffers}
                  onChange={handlePreferenceChange}
                  name="promotionalOffers"
                  disabled={!isEditing}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="mobile-notification-item">
              <div className="notification-info">
                <FaNewspaper />
                <div>
                  <h4>Newsletter</h4>
                  <p>Monthly newsletter</p>
                </div>
              </div>
              <label className="mobile-switch">
                <input
                  type="checkbox"
                  checked={notificationPrefs.newsletter}
                  onChange={handlePreferenceChange}
                  name="newsletter"
                  disabled={!isEditing}
                />
                <span className="slider"></span>
              </label>
            </div>

            {isEditing && (
              <div className="mobile-notification-note">
                <FaInfoCircle />
                <p>Save changes to update notification preferences</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button className="nav-btn">
          <FaHome />
          <span>Home</span>
        </button>
        <button className="nav-btn">
          <FaBox />
          <span>Orders</span>
        </button>
        <button className="nav-btn active">
          <FaUser />
          <span>Profile</span>
        </button>
        <button className="nav-btn">
          <FaHistory />
          <span>History</span>
        </button>
        <button className="nav-btn">
          <FaTags />
          <span>Offers</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMobile;