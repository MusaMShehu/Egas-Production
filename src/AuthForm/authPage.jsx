// pages/AuthPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, MapPin, Crosshair } from 'lucide-react';
import "./authPage.css";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [locationLoading, setLocationLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const fileInputRef = useRef(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    profileImage: null,
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;
    setSignupData({
      ...signupData,
      [name]: files ? files[0] : value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size too large. Maximum size is 5MB.",
      });
      return;
    }

    setSignupData({
      ...signupData,
      profileImage: file,
    });

    setMessage({
      type: "success",
      text: "Profile image selected!",
    });
  };

  // Remove profile image
  const removeProfileImage = () => {
    setSignupData({
      ...signupData,
      profileImage: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setMessage({ type: "info", text: "Profile image removed" });
  };

  // Get location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage({
        type: "error",
        text: "Geolocation not supported on this browser.",
      });
      return;
    }

    setLocationLoading(true);
    setMessage({
      type: "info",
      text: "Detecting your location...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setSignupData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8),
        }));

        setMessage({
          type: "success",
          text: `Location detected successfully!`,
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Failed to get location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setMessage({ type: "error", text: errorMessage });
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await login(loginData.email, loginData.password);
      setMessage({ type: "success", text: "Welcome back!" });
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate signup form
  const validateSignupForm = () => {
    const errors = [];

    const requiredFields = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      dob: "Date of Birth",
      gender: "Gender",
      address: "Address",
      city: "City",
      state: "State",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!signupData[field]) {
        errors.push(`${name} is required`);
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (signupData.email && !emailRegex.test(signupData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (signupData.phone && signupData.phone.replace(/\D/g, "").length < 10) {
      errors.push("Please enter a valid phone number");
    }

    if (signupData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (signupData.dob) {
      const dob = new Date(signupData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 18) {
        errors.push("You must be at least 18 years old to register");
      }
    }

    if (!signupData.latitude || !signupData.longitude) {
      errors.push("GPS coordinates are required for delivery services");
    }

    if (!termsAccepted) {
      errors.push("You must accept the Terms and Conditions to continue");
    }

    if (errors.length > 0) {
      setMessage({ type: "error", text: errors[0] });
      return false;
    }

    return true;
  };

  // Handle signup submission
  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage({ type: "", text: "" });

  //   if (!validateSignupForm()) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
      
  //     formData.append("firstName", signupData.firstName.trim());
  //     formData.append("lastName", signupData.lastName.trim());
  //     formData.append("email", signupData.email.trim().toLowerCase());
  //     formData.append("phone", signupData.phone.trim());
  //     formData.append("password", signupData.password);
  //     formData.append("confirmPassword", signupData.confirmPassword);
  //     formData.append("dob", signupData.dob);
  //     formData.append("gender", signupData.gender);
  //     formData.append("address", signupData.address.trim());
  //     formData.append("city", signupData.city.trim());
  //     formData.append("state", signupData.state);

  //     if (signupData.profileImage) {
  //       formData.append("profileImage", signupData.profileImage);
  //     }

  //     const geoJson = {
  //       type: "Point",
  //       coordinates: [
  //         parseFloat(signupData.longitude),
  //         parseFloat(signupData.latitude),
  //       ],
  //     };
  //     formData.append("gps", JSON.stringify(geoJson));

  //     await register(formData);
      
  //     setMessage({
  //       type: "success",
  //       text: "Registration successful! You will be redirected shortly.",
  //     });

  //     setTimeout(() => {
  //       window.location.href = "/dashboard";
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Registration error:", error);
      
  //     let errorMessage = "Registration failed. Please try again.";
      
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }
      
  //     setMessage({ type: "error", text: errorMessage });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle signup submission
const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: "", text: "" });

  if (!validateSignupForm()) {
    setLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    
    // Append all fields
    formData.append("firstName", signupData.firstName.trim());
    formData.append("lastName", signupData.lastName.trim());
    formData.append("email", signupData.email.trim().toLowerCase());
    formData.append("phone", signupData.phone.trim());
    formData.append("password", signupData.password);
    formData.append("confirmPassword", signupData.confirmPassword);
    formData.append("dob", signupData.dob);
    formData.append("gender", signupData.gender);
    formData.append("address", signupData.address.trim());
    formData.append("city", signupData.city.trim());
    formData.append("state", signupData.state);

    // Append profile image if exists
    if (signupData.profileImage) {
      formData.append("profileImage", signupData.profileImage);
    }

    // Create and append GPS coordinates
    const geoJson = {
      type: "Point",
      coordinates: [
        parseFloat(signupData.longitude),
        parseFloat(signupData.latitude),
      ],
    };
    formData.append("gps", JSON.stringify(geoJson));

    // Log FormData contents for debugging
    console.log("Submitting registration...");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.type})`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    const result = await register(formData);
    
    console.log('Registration result:', result);
    
    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Registration successful! You will be redirected shortly.",
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      // Handle validation errors
      if (result.validationErrors) {
        const firstError = Array.isArray(result.validationErrors) 
          ? result.validationErrors[0] 
          : result.validationErrors;
        
        setMessage({ 
          type: "error", 
          text: firstError?.msg || firstError || result.message 
        });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    setMessage({ 
      type: "error", 
      text: error.message || "Registration failed. Please try again." 
    });
  } finally {
    setLoading(false);
  }
};

  // Switch forms
  const switchToLogin = () => {
    setIsLogin(true);
    setMessage({ type: "", text: "" });
    setLoginData({ email: "", password: "" });
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setMessage({ type: "", text: "" });
    setTermsAccepted(false);
    setSignupData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      dob: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
      profileImage: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        if (message.type !== "success" || !loading) {
          setMessage({ type: "", text: "" });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, loading]);

  return (
    <div className="auth-auth-container">
      <div className="auth-auth-card">
        {/* Header Section */}
        <div className="auth-auth-header">
          <div className="auth-auth-tabs">
            <button
              className={`auth-tab-button ${isLogin ? "auth-active" : ""}`}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button
              className={`auth-tab-button ${!isLogin ? "auth-active" : ""}`}
              onClick={switchToSignup}
            >
              Sign Up
            </button>
          </div>
          <h2>{isLogin ? "Welcome to e-Gas" : "Create Account"}</h2>
          <p>
            {isLogin
              ? "Sign in to your account to continue"
              : "Join e-Gas today and get started"}
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>{message.text}</div>
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

            <div className="auth-form-group password-field">
              <input
                type={showPassword.login ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('login')}
                disabled={loading}
              >
                {showPassword.login ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="auth-auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
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
                  style={{ display: "none" }}
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
                      <small>Optional</small>
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
                  placeholder="First Name"
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
                  placeholder="Last Name"
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
                placeholder="Email Address"
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
                placeholder="Phone Number"
                value={signupData.phone}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-row">
              <div className="auth-form-group password-field">
                <input
                  type={showPassword.signup ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('signup')}
                  disabled={loading}
                >
                  {showPassword.signup ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="auth-form-group password-field">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={loading}
                >
                  {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
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
                  <option value="">Select Gender</option>
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
                placeholder="Address"
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
                  placeholder="City"
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
                  <option value="">Select State</option>
                  <option value="Borno">Borno</option>
                  <option value="Yobe">Yobe</option>
                </select>
              </div>
            </div>

            {/* Location Section */}
            <div className="auth-location-section">
              <div className="auth-location-buttons">
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
                    <>
                      <MapPin size={18} />
                      Get Location
                    </>
                  )}
                </button>
              </div>
              <div className="auth-coordinates-row">
                <div className="auth-form-group">
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Latitude"
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
                    placeholder="Longitude"
                    value={signupData.longitude}
                    onChange={handleSignupChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="auth-terms-checkbox">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  I accept the{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-auth-button"
              disabled={loading || !termsAccepted}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        {/* Switch Auth Type */}
        <div className="auth-auth-switch">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={switchToSignup}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={switchToLogin}
              >
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