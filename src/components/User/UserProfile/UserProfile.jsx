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
    gpsCoordinates: { type: "Point", coordinates: [0, 0] },
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

  const API_BASE_URL = "https://egas-server-1.onrender.com/api/v1/auth";

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
            gpsCoordinates: result.user.gpsCoordinates || {
              type: "Point",
              coordinates: [0, 0],
            },
            profilePic: result.user.profilePic || "default.jpg",
            memberSince: result.user.createdAt || "",
          });

          if (result.user.notificationPreferences) {
            setNotificationPrefs(result.user.notificationPreferences);
          }

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
      [name]: value,
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({
      ...notificationPrefs,
      [name]: checked,
    });
  };

  // ✅ Update current location capture
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
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
          alert("Location captured successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Failed to get current location. Please enable location services."
          );
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");

      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
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

      setIsEditing(false);
      setIsLoading(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile. Please try again.");
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("profileImage", file);

        const response = await fetch(`${API_BASE_URL}/profile/image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        setUser({
          ...user,
          profilePic: result.data.profilePic,
        });
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload profile picture. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return "Member since 2023";
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
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
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <FaEdit className="prof-btn-icon" />
              Edit Profile
            </button>
          ) : (
            <div className="prof-edit-actions">
              <button
                className="prof-btn-secondary"
                onClick={() => setIsEditing(false)}
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
          <button onClick={() => setError("")} className="prof-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="prof-profile-content">
        <div className="prof-profile-card">
          <div className="prof-profile-header">
            <div className="prof-profile-image">
              <img
                src={user.profilePic || "default.jpg"}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "default.jpg";
                }}
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
                </div>
              )}
            </div>
            <div className="prof-profile-info">
              <h2>
                <FaUser className="prof-title-icon" />
                {user.firstName} {user.lastName}
              </h2>
              <p>{formatMemberSince(user.memberSince)}</p>
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
                    value={user.dob}
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
                      onChange={(e) => {
                        const [lat, lng] = e.target.value
                          .split(",")
                          .map((v) => parseFloat(v.trim()));
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