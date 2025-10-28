import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/Api";
import "../../styles/SignInUp.css";
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

const SignupForm = ({ onClose }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    state: "",
    city: "",
    gps: "",
    profilePic: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = "Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.";
      setError(errorMsg);
      errorToast(errorMsg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "File size too large. Maximum size is 5MB.";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    setForm({ ...form, profilePic: file });
    setError("");
    successToast("Profile picture selected successfully!");

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      infoToast("Profile picture preview loaded");
    };
    reader.readAsDataURL(file);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation not supported on this browser.";
      setError(errorMsg);
      errorToast(errorMsg);
      return;
    }

    setGpsLoading(true);
    infoToast("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const geoJson = JSON.stringify({
          type: "Point",
          coordinates: [longitude, latitude],
        });

        setForm((prev) => ({ ...prev, gps: geoJson }));
        setGpsLoading(false);
        successToast("GPS coordinates captured successfully!");
      },
      (err) => {
        const errorMsg = "Failed to get GPS location. Please enable location services.";
        setError(errorMsg);
        errorToast(errorMsg);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateForm = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      const errorMsg = "All required fields must be filled.";
      setError(errorMsg);
      warningToast(errorMsg);
      return false;
    }
    if (form.password !== form.confirmPassword) {
      const errorMsg = "Passwords do not match!";
      setError(errorMsg);
      errorToast(errorMsg);
      return false;
    }
    if (form.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long.";
      setError(errorMsg);
      warningToast(errorMsg);
      return false;
    }
    if (!form.state || !form.city) {
      const errorMsg = "Please select your state and city.";
      setError(errorMsg);
      warningToast(errorMsg);
      return false;
    }
    if (!form.gps) {
      const errorMsg = "Please pick your GPS coordinates for delivery services.";
      setError(errorMsg);
      warningToast(errorMsg);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    
    setLoading(true);
    infoToast("Creating your account...");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "profilePic" && form[key]) {
          formData.append("profilePic", form[key]);
        } else if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      const res = await API.post("/api/v1/auth/register", formData);

      if (res.data.success) {
        // Store token + user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        successToast("🎉 Account created successfully! Welcome to eGas!");
        
        // Show additional welcome info
        setTimeout(() => {
          infoToast(`Welcome ${form.firstName}! Redirecting to dashboard...`);
        }, 1000);

        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 2000);
        }

        // Redirect to dashboard after showing success messages
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        const errorMsg = res.data.error || "Signup failed. Please try again.";
        setError(errorMsg);
        errorToast(errorMsg);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed. Please try again.";
      setError(msg);
      
      // Specific error handling
      if (err.response?.status === 409) {
        errorToast("Email already exists. Please use a different email.");
      } else if (err.response?.status === 400) {
        errorToast("Invalid data provided. Please check your information.");
      } else if (err.message?.includes("network")) {
        errorToast("Network error. Please check your connection.");
      } else {
        errorToast(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePic = () => {
    setForm({ ...form, profilePic: null });
    setPreviewUrl(null);
    infoToast("Profile picture removed");
  };

  const handleClearForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      dob: "",
      gender: "",
      state: "",
      city: "",
      gps: "",
      profilePic: null,
    });
    setPreviewUrl(null);
    setError("");
    infoToast("Form cleared successfully");
  };

  const handleFormClose = () => {
    if (!loading) {
      infoToast("Registration cancelled");
      onClose();
    }
  };

  const handleDemoFill = () => {
    setForm({
      firstName: "John",
      lastName: "Doe",
      email: "demo@example.com",
      phone: "+2348012345678",
      address: "123 Demo Street",
      password: "demo123",
      confirmPassword: "demo123",
      dob: "1990-01-01",
      gender: "male",
      state: "Borno",
      city: "Maiduguri",
      gps: JSON.stringify({
        type: "Point",
        coordinates: [13.151369, 11.833333]
      }),
      profilePic: null,
    });
    successToast("Demo data filled. You can now test the signup!");
  };

  return (
    <div className="sign-container">
      <div className="auth-header">
        <h2>Create Your Account</h2>
        <p>Join eGas for seamless gas delivery services</p>
      </div>

      {/* Demo fill button */}
      <div className="demo-section">
        <button 
          type="button" 
          className="demo-fill-btn"
          onClick={handleDemoFill}
          disabled={loading}
        >
          Fill Demo Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              type="button" 
              className="clear-error"
              onClick={() => {
                setError("");
                infoToast("Error message cleared");
              }}
            >
              ×
            </button>
          </div>
        )}

        <div className="input-container">
          <div className="form-row">
            <div className="input-group">
              <label className="input-label">First Name *</label>
              <input 
                type="text" 
                className="auth-input-field" 
                name="firstName" 
                placeholder="Enter your first name" 
                value={form.firstName} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Last Name *</label>
              <input 
                type="text" 
                className="auth-input-field" 
                name="lastName" 
                placeholder="Enter your last name" 
                value={form.lastName} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <input 
              type="email" 
              className="auth-input-field" 
              name="email" 
              placeholder="Enter your email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Phone Number *</label>
              <input 
                type="tel" 
                className="auth-input-field" 
                name="phone" 
                placeholder="+2348012345678" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Date of Birth</label>
              <input 
                type="date" 
                className="auth-input-field" 
                name="dob" 
                value={form.dob} 
                onChange={handleChange} 
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Address</label>
            <input 
              type="text" 
              className="auth-input-field" 
              name="address" 
              placeholder="Your complete address" 
              value={form.address} 
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">State *</label>
              <select 
                className="auth-input-field" 
                name="state" 
                value={form.state} 
                onChange={handleChange} 
                required 
                disabled={loading}
              >
                <option value="">Select State</option>
                <option value="Borno">Borno</option>
                <option value="Yobe">Yobe</option>
                <option value="Adamawa">Adamawa</option>
                <option value="Bauchi">Bauchi</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">City *</label>
              <input 
                type="text" 
                className="auth-input-field" 
                name="city" 
                placeholder="Your city" 
                value={form.city} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Gender</label>
            <select 
              className="auth-input-field" 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Password *</label>
              <input 
                type="password" 
                className="auth-input-field" 
                name="password" 
                placeholder="Minimum 6 characters" 
                value={form.password} 
                onChange={handleChange} 
                required 
                disabled={loading}
                minLength="6"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm Password *</label>
              <input 
                type="password" 
                className="auth-input-field" 
                name="confirmPassword" 
                placeholder="Confirm your password" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                required 
                disabled={loading}
                minLength="6"
              />
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="file-upload-section">
            <label className="file-upload-label">
              Profile Picture (Optional)
              <input 
                type="file" 
                className="file-input" 
                name="profilePic" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={loading}
              />
              <span className="file-upload-button">
                {loading ? "Uploading..." : "Choose File"}
              </span>
            </label>
            <small>Supported: JPEG, PNG, GIF, WEBP (Max 5MB)</small>

            {previewUrl && (
              <div className="image-preview-container">
                <img src={previewUrl} alt="Profile preview" className="image-preview" />
                <button 
                  type="button" 
                  className="remove-image-btn" 
                  onClick={removeProfilePic}
                  disabled={loading}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* GPS Section */}
          <div className="gps-section">
            <label className="input-label">GPS Coordinates *</label>
            <button 
              type="button" 
              className={`gps-button ${form.gps ? 'success' : ''}`} 
              onClick={handleGPS} 
              disabled={gpsLoading || loading}
            >
              {gpsLoading ? (
                <>
                  <div className="button-spinner-small"></div>
                  Getting Location...
                </>
              ) : form.gps ? (
                "✅ GPS Coordinates Set"
              ) : (
                "📍 Pick GPS Coordinates"
              )}
            </button>
            {form.gps && (
              <small className="gps-success">Location captured for accurate deliveries</small>
            )}
          </div>

          <div className="form-actions">
            <button 
              className="auth-button primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="secondary-actions">
              <button
                type="button"
                className="auth-button secondary"
                onClick={handleClearForm}
                disabled={loading}
              >
                Clear Form
              </button>
              <button
                type="button"
                className="auth-button secondary"
                onClick={handleFormClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <p>Setting up your account...</p>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="security-notice">
        <p>🔒 Your information is secure and encrypted</p>
        <p>📍 GPS required for accurate gas delivery services</p>
      </div>
    </div>
  );
};

export default SignupForm;