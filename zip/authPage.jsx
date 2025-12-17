
import React, { useState, useRef } from 'react';
import { useAuth } from "../contexts/AuthContext";
import API from '../utils/Api';
import './authPage.css';

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state - UPDATED TO MATCH BACKEND
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    profileImage: null
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;
    setSignupData({
      ...signupData,
      [name]: files ? files[0] : value
    });
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: "Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: "File size too large. Maximum size is 5MB." });
      return;
    }

    setSignupData({
      ...signupData,
      profileImage: file
    });

    setMessage({ type: 'success', text: 'Profile image selected successfully!' });
  };

  // Remove profile image
  const removeProfileImage = () => {
    setSignupData({
      ...signupData,
      profileImage: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // GPS location detection
  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation not supported on this browser.' });
      return;
    }

    setLocationLoading(true);
    setMessage({ type: 'info', text: 'Detecting your location...' });

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setSignupData(prev => ({
          ...prev,
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8)
        }));
        
        setMessage({ 
          type: 'success', 
          text: 'Location detected successfully!' 
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your GPS.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unexpected error occurred while getting location.';
            break;
        }

        setMessage({ type: 'error', text: errorMessage });
        setLocationLoading(false);
      },
      options
    );
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await login(loginData.email, loginData.password);
      setMessage({ type: 'success', text: 'Welcome back!' });
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || "Login failed"
      });
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateSignupForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'dob', 'gender', 'address', 'city', 'state'];
    
    for (const field of requiredFields) {
      if (!signupData[field]) {
        setMessage({ type: 'error', text: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}` });
        return false;
      }
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match!" });
      return false;
    }
    
    if (signupData.password.length < 6) {
      setMessage({ type: 'error', text: "Password must be at least 6 characters long." });
      return false;
    }
    
    if (!signupData.latitude || !signupData.longitude) {
      setMessage({ type: 'error', text: "Please provide GPS coordinates." });
      return false;
    }
    
    return true;
  };

  // Handle signup submission - UPDATED FOR CLOUDINARY
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!validateSignupForm()) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Append all form data - UPDATED FIELD NAMES TO MATCH BACKEND
      formData.append('firstName', signupData.firstName);
      formData.append('lastName', signupData.lastName);
      formData.append('email', signupData.email);
      formData.append('phone', signupData.phone);
      formData.append('password', signupData.password);
      formData.append('confirmPassword', signupData.confirmPassword);
      formData.append('dob', signupData.dob);
      formData.append('gender', signupData.gender);
      formData.append('address', signupData.address);
      formData.append('city', signupData.city);
      formData.append('state', signupData.state);
      
      // Append profile image with correct field name
      if (signupData.profileImage) {
        // Backend expects 'profileImage' as the field name for the file upload
        formData.append('profileImage', signupData.profileImage);
      }
      
      // Create GPS GeoJSON - UPDATED TO MATCH BACKEND
      const geoJson = JSON.stringify({
        type: "Point",
        coordinates: [parseFloat(signupData.longitude), parseFloat(signupData.latitude)]
      });
      formData.append('gps', geoJson);

      // Debug: Log form data
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Make API call - UPDATED ENDPOINT
      const response = await API.post("/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setMessage({ type: 'success', text: response.data.message || 'Registration successful!' });
        
        // Auto login after registration
        try {
          await login(signupData.email, signupData.password);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } catch (loginError) {
          // Redirect to login page if auto-login fails
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      } else {
        setMessage({ 
          type: 'error', 
          text: response.data.error || "Registration failed. Please try again." 
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Reset forms when switching
  const switchToLogin = () => {
    setIsLogin(true);
    setMessage({ type: '', text: '' });
    setLoginData({ email: '', password: '' });
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setMessage({ type: '', text: '' });
    setSignupData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      dob: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      latitude: '',
      longitude: '',
      profileImage: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="auth-auth-container">
      <div className="auth-auth-card">
        {/* Header Section */}
        <div className="auth-auth-header">
          <div className="auth-auth-tabs">
            <button 
              className={`auth-tab-button ${isLogin ? 'auth-active' : ''}`}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button 
              className={`auth-tab-button ${!isLogin ? 'auth-active' : ''}`}
              onClick={switchToSignup}
            >
              Sign Up
            </button>
          </div>
          <h2>{isLogin ? 'Welcome to e-Gas' : 'Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Join e-Gas today and get started'
            }
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Login Form */}
        {isLogin && (
          <form className="auth-auth-form" onSubmit={handleLogin}>
            <div className="auth-form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <button type="submit" className="auth-auth-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="auth-auth-footer">
              <a href="/forgot-password" className="auth-forgot-link">
                Forgot your password?
              </a>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <form className="auth-auth-form" onSubmit={handleSignup}>
            {/* Profile Image Upload */}
            <div className="auth-profile-image-section">
              <div className="auth-image-upload-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={loading}
                  name="profileImage"
                />
                <div className="auth-image-preview">
                  {signupData.profileImage ? (
                    <div className="auth-image-with-remove">
                      <img 
                        src={URL.createObjectURL(signupData.profileImage)} 
                        alt="Profile preview" 
                        className="auth-profile-preview"
                      />
                      <button 
                        type="button" 
                        className="auth-remove-image"
                        onClick={removeProfileImage}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="auth-image-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span>📷</span>
                      <p>Add Profile Photo</p>
                      <small>Optional - Will be stored on Cloudinary</small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="auth-form-row">
              <div className="auth-form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={signupData.firstName}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="auth-form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={signupData.lastName}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={signupData.email}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={signupData.phone}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-row">
              <div className="auth-form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password *"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
              <div className="auth-form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password *"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
            </div>

            <div className="auth-form-row">
              <div className="auth-form-group">
                <input
                  type="date"
                  name="dob"
                  placeholder="Date of Birth"
                  value={signupData.dob}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="auth-form-group">
                <select 
                  name="gender" 
                  value={signupData.gender} 
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                >
                  <option value="">Gender *</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="auth-form-group">
              <input
                type="text"
                name="address"
                placeholder="Address *"
                value={signupData.address}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-row">
              <div className="auth-form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={signupData.city}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="auth-form-group">
                <select 
                  name="state" 
                  value={signupData.state} 
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select State *</option>
                  <option value="Borno">Borno</option>
                  <option value="Yobe">Yobe</option>
                  {/* Add more states as needed */}
                </select>
              </div>
            </div>

            {/* Location Section */}
            <div className="auth-location-section">
              <div className="auth-location-header">
                <h4>GPS Location (Required)</h4>
                <button 
                  type="button" 
                  onClick={getLocation} 
                  className="auth-location-button"
                  disabled={locationLoading || loading}
                >
                  {locationLoading ? (
                    <>
                      <span className="auth-spinner-small"></span>
                      Detecting...
                    </>
                  ) : (
                    '📍 Auto-detect Location'
                  )}
                </button>
              </div>
              
              <div className="auth-coordinates-row">
                <div className="auth-form-group">
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Latitude *"
                    value={signupData.latitude}
                    onChange={handleSignupChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="auth-form-group">
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Longitude *"
                    value={signupData.longitude}
                    onChange={handleSignupChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="auth-location-tips">
                <p><strong>Note:</strong> GPS coordinates are required for delivery services</p>
              </div>
            </div>

            <button type="submit" className="auth-auth-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="auth-terms-notice">
              <small>By creating an account, you agree to our Terms of Service and Privacy Policy</small>
            </div>
          </form>
        )}

        {/* Switch Auth Type */}
        <div className="auth-auth-switch">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={switchToSignup}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={switchToLogin}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;