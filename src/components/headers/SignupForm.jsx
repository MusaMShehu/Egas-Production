import React, { useState } from "react";
import API from "../../utils/Api";
import "../../styles/SignInUp.css";

const SignupForm = ({ setUser, onClose }) => {
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
  const [previewUrl, setPreviewUrl] = useState(null); // For image preview

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }

      setForm({ ...form, profilePic: file });
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            gps: `${pos.coords.latitude}, ${pos.coords.longitude}`,
          }));
          setGpsLoading(false);
        },
        () => {
          setError("Failed to get GPS location.");
          setGpsLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported on this browser.");
    }
  };

  const validateForm = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("All required fields must be filled.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare form data for file upload
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(form).forEach((key) => {
        if (key === 'profilePic' && form[key]) {
          // Append the file with the correct field name
          formData.append('profilePic', form[key]);
        } else if (form[key] !== null && form[key] !== undefined) {
          // Append other fields
          formData.append(key, form[key]);
        }
      });

      // Register new user with multipart/form-data
      const { data } = await API.post("/register", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });

      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }

      // Save token + minimal user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update React state immediately
      setUser(data.user);

      // Hydrate full profile
      try {
        const profileRes = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (profileRes.data?.user) {
          setUser(profileRes.data.user);
          localStorage.setItem("user", JSON.stringify(profileRes.data.user));
        }
      } catch (profileErr) {
        console.warn("Could not fetch full profile:", profileErr);
      }

      alert(`Welcome ${data.user.firstName}, your account has been created!`);
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePic = () => {
    setForm({ ...form, profilePic: null });
    setPreviewUrl(null);
  };

  return (
    <div className="sign-container">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}

        <div className="input-container">
          <input
            type="text"
            className="auth-input-field"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            className="auth-input-field"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="auth-input-field"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            className="auth-input-field"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            className="auth-input-field"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
          <input
            type="password"
            className="auth-input-field"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="auth-input-field"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            className="auth-input-field"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <select
            className="auth-input-field"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            className="auth-input-field"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            <option value="Borno">Borno</option>
            <option value="Yobe">Yobe</option>
          </select>

          <input
            type="text"
            className="auth-input-field"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          {/* Profile Picture Upload Section */}
          <div className="file-upload-section">
            <label className="file-upload-label">
              Profile Picture
              <input
                type="file"
                className="file-input"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span className="file-upload-button">Choose File</span>
            </label>
            
            {previewUrl && (
              <div className="image-preview-container">
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeProfilePic}
                >
                  Remove
                </button>
              </div>
            )}
            
            {form.profilePic && (
              <small className="file-info">
                Selected: {form.profilePic.name} ({Math.round(form.profilePic.size / 1024)} KB)
              </small>
            )}
          </div>

          <button
            type="button"
            className="gps-button"
            onClick={handleGPS}
            disabled={gpsLoading}
          >
            {gpsLoading ? "Fetching GPS..." : "Pick GPS Coordinates"}
          </button>

          {form.gps && <small>GPS: {form.gps}</small>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;