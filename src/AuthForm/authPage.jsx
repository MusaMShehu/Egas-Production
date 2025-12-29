// import React, { useState, useRef } from "react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/Api";
import axios from "axios";
import "./authPage.css";

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

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

  // Handle profile image upload (using your existing validation logic)
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

    // Add Cloudinary message
    setMessage({
      type: "success",
      text: "Profile image selected! It will be uploaded to Cloudinary.",
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

  // Enhanced GPS location detection with high accuracy
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
      text: "Detecting your location with high accuracy... Please wait.",
    });

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    };

    let bestPosition = null;
    let attempts = 0;
    const maxAttempts = 3;

    const tryGetLocation = () => {
      attempts++;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
            bestPosition = position;
          }

          if (accuracy <= 20) {
            setSignupData((prev) => ({
              ...prev,
              latitude: latitude.toFixed(8),
              longitude: longitude.toFixed(8),
            }));

            setMessage({
              type: "success",
              text: `High accuracy location detected! (Accuracy: ${Math.round(
                accuracy
              )} meters)`,
            });
            setLocationLoading(false);
          } else if (attempts >= maxAttempts) {
            const finalAccuracy = bestPosition.coords.accuracy;
            setSignupData((prev) => ({
              ...prev,
              latitude: bestPosition.coords.latitude.toFixed(8),
              longitude: bestPosition.coords.longitude.toFixed(8),
            }));

            setMessage({
              type: attempts === 1 ? "success" : "warning",
              text: `Location detected with ${Math.round(
                finalAccuracy
              )} meters accuracy. ${
                finalAccuracy > 50
                  ? "For better accuracy, move to an open area."
                  : ""
              }`,
            });
            setLocationLoading(false);
          } else {
            setMessage({
              type: "info",
              text: `Refining location... Attempt ${attempts}/${maxAttempts} (Current accuracy: ${Math.round(
                accuracy
              )} meters)`,
            });
            setTimeout(tryGetLocation, 3000);
          }
        },
        (error) => {
          let errorMessage;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please allow location permissions in your browser settings and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                "Location information unavailable. Please check your GPS and internet connection.";
              break;
            case error.TIMEOUT:
              if (attempts < maxAttempts) {
                setMessage({
                  type: "info",
                  text: `Location request timed out. Retrying... (${attempts}/${maxAttempts})`,
                });
                setTimeout(tryGetLocation, 3000);
                return;
              }
              errorMessage =
                "Unable to get location. Please ensure GPS is enabled or enter coordinates manually.";
              break;
            default:
              errorMessage =
                "An unexpected error occurred while getting location.";
              break;
          }

          setMessage({ type: "error", text: errorMessage });
          setLocationLoading(false);
        },
        options
      );
    };

    tryGetLocation();
  };

  // Alternative: Use watchPosition for continuous updates (most accurate)
  const getPreciseLocation = () => {
    if (!navigator.geolocation) {
      setMessage({
        type: "error",
        text: "Geolocation is not supported by your browser",
      });
      return;
    }

    setLocationLoading(true);
    setMessage({
      type: "info",
      text: "Getting precise location... This may take 10-15 seconds.",
    });

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    };

    let watchId;
    let timeoutId;

    if (window.locationWatchId) {
      navigator.geolocation.clearWatch(window.locationWatchId);
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy <= 30) {
          navigator.geolocation.clearWatch(watchId);
          clearTimeout(timeoutId);

          setSignupData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(8),
            longitude: longitude.toFixed(8),
          }));

          setMessage({
            type: "success",
            text: `Precise location detected! (Accuracy: ${Math.round(
              accuracy
            )} meters)`,
          });
          setLocationLoading(false);
        } else {
          setMessage({
            type: "info",
            text: `Refining location... Current accuracy: ${Math.round(
              accuracy
            )} meters`,
          });
        }
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId);
        clearTimeout(timeoutId);

        let errorMessage = "Failed to get precise location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please allow location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information unavailable. Please check your GPS.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Precise location detection timed out. Try the standard location detection.";
            break;
        }

        setMessage({ type: "error", text: errorMessage });
        setLocationLoading(false);
      },
      options
    );

    timeoutId = setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      setMessage({
        type: "warning",
        text: "Precise location detection taking too long. Try standard location detection or enter manually.",
      });
      setLocationLoading(false);
    }, 20000);

    window.locationWatchId = watchId;
  };

  // Handle login submission using your existing AuthContext logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await login(loginData.email, loginData.password);
      setMessage({ type: "success", text: "Welcome back!" });

      // Redirect to dashboard after successful login
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

  // Enhanced form validation using your existing logic
  const validateSignupForm = () => {
    const errors = [];

    // Required fields
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (signupData.email && !emailRegex.test(signupData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Phone validation
    if (signupData.phone && signupData.phone.replace(/\D/g, "").length < 10) {
      errors.push("Please enter a valid phone number");
    }

    // Password validation
    if (signupData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // Age validation (18+)
    if (signupData.dob) {
      const dob = new Date(signupData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (age < 18) {
        errors.push("You must be at least 18 years old to register");
      }
    }

    // GPS coordinates
    if (!signupData.latitude || !signupData.longitude) {
      errors.push("GPS coordinates are required for delivery services");
    }

    if (errors.length > 0) {
      setMessage({ type: "error", text: errors[0] });
      return false;
    }

    return true;
  };

  // Handle signup submission using your existing API logic
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

      // Append user data with CORRECT field names for Cloudinary backend
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

      // Append profile image with CORRECT field name for multer middleware
      // Backend expects 'profileImage' NOT 'profilePic'
      if (signupData.profileImage) {
        formData.append("profileImage", signupData.profileImage);
      }

      // Create GPS GeoJSON in correct format
      const geoJson = {
        type: "Point",
        coordinates: [
          parseFloat(signupData.longitude),
          parseFloat(signupData.latitude),
        ],
      };
      formData.append("gps", JSON.stringify(geoJson));

      // Debug: Log form data
      console.log("Submitting registration to Cloudinary backend...");
      for (let [key, value] of formData.entries()) {
        console.log(
          `${key}:`,
          value instanceof File ? `${value.name} (${value.type})` : value
        );
      }

      // Make API call to CORRECT endpoint
      // Changed from "/api/v1/auth/register" to "/auth/register"
      const response = await API.post("/api/v1/auth/register", formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        timeout: 30000, // 30 seconds timeout for file upload
      });

      console.log("Registration successful:", response.data);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Registration successful! You will be redirected shortly.",
        });

        // Auto login after successful registration
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        // Server responded with error
        const serverError = error.response.data;

        if (serverError.error) {
          errorMessage = serverError.error;
        } else if (serverError.message) {
          errorMessage = serverError.message;
        } else if (serverError.errors) {
          // Handle validation errors from backend
          const firstError = serverError.errors[0];
          errorMessage = firstError?.msg || JSON.stringify(serverError.errors);
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage =
          "No response from server. Please check your internet connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Reset forms when switching
  const switchToLogin = () => {
    setIsLogin(true);
    setMessage({ type: "", text: "" });
    setLoginData({ email: "", password: "" });
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setMessage({ type: "", text: "" });
    // Reset signup data but keep the structure
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
                  name="profileImage" // ADD THIS LINE
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
                      <small>
                        Optional - Will be stored securely on Cloudinary
                      </small>
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
              <div className="auth-form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
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
                  placeholder="Confirm Password"
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
                  disabled={loading}
                />
              </div>
              <div className="auth-form-group">
                <select
                  name="gender"
                  value={signupData.gender}
                  onChange={handleSignupChange}
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

            {/* Enhanced Location Section */}
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
                    "Get Location"
                  )}
                </button>
                <button
                  type="button"
                  onClick={getPreciseLocation}
                  className="auth-location-button precise"
                  disabled={locationLoading || loading}
                >
                  {locationLoading ? (
                    <>
                      <span className="auth-spinner-small"></span>
                      Getting Precise...
                    </>
                  ) : (
                    "Precise Location"
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
              <div className="auth-location-tips">
                <p>
                  💡 <strong>Tips for better accuracy:</strong>
                </p>
                <ul>
                  <li>Enable GPS on your device</li>
                  <li>Move to an open area</li>
                  <li>Use "Precise Location" for highest accuracy</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              className="auth-auth-button"
              disabled={loading}
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

            {/* Add this section */}
            <div className="auth-terms-notice">
              <p>
                By creating an account, you agree to our{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </p>
            </div>
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
