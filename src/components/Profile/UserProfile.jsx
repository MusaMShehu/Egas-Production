// src/components/UserProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./UserProfile.css";

const UserProfile = () => {
  const { user: authUser, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    deliveryGps: "",
  });

  // Fetch user data when component mounts or token changes
  // useEffect(() => {
  //   if (token) {
  //     setLoading(true);
  //     axios.get("https://egas-server.onrender.com/api/v1/auth/me", {
  //       headers: { Authorization: `Bearer ${token}` }
  //     })
  //       .then((res) => {
  //         setUser(res.data);
  //         setFormData({
  //           firstName: res.data.firstName || '',
  //           lastName: res.data.lastName || '',
  //           email: res.data.email || '',
  //           phone: res.data.phone || '',
  //           dateOfBirth: res.data.dateOfBirth || '',
  //           gender: res.data.gender || '',
  //           address: res.data.address || '',
  //           deliveryGps: res.data.deliveryGps || ''
  //         });
  //       })
  //       .catch((err) => console.error(err))
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, [token]);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchUserData = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);

        const response = await axios.get(
          "https://egas-server.onrender.com/api/v1/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (isMounted && response.data) {
          setUser(response.data);
          setFormData({
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            dateOfBirth: response.data.dateOfBirth || "",
            gender: response.data.gender || "",
            address: response.data.address || "",
            deliveryGps: response.data.deliveryGps || "",
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching user data:", err);

          // Handle specific error cases
          if (err.response?.status === 401) {
            // Token is invalid or expired
            console.error("Authentication failed. Please login again.");
            localStorage.removeItem("token");
            // You might want to redirect to login page here
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   axios.put("https://egas-server.onrender.com/api/v1/updatedetails/:id", formData, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //     .then((res) => {
  //       setUser(res.data);
  //       setIsEditing(false);
  //     })
  //     .catch((err) => console.error(err));
  // };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Make sure we have the user ID
      if (!user || !user._id) {
        console.error("User ID is missing");
        return;
      }

      const response = await axios.put(
        `https://egas-server.onrender.com/api/v1/updatedetails/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        // Update the user state with the new data
        setUser(response.data.user || response.data);
        setIsEditing(false);

        // Show success message (you can use a toast notification here)
        alert("Profile updated successfully!");
      } else {
        console.error("Unexpected response format:", response.data);
        alert("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      // Better error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);

        if (err.response.status === 401) {
          alert("Session expired. Please login again.");
          // Optionally redirect to login page or logout
        } else if (err.response.status === 400) {
          alert("Invalid data. Please check your inputs.");
        } else {
          alert("An error occurred. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        alert("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
      address: user.address || "",
      deliveryGps: user.deliveryGps || "",
    });
    setIsEditing(false);
  };

  if (!token)
    return <p className="profile-value">Please login to view profile</p>;
  if (loading) return <p className="profile-value">Loading profile...</p>;
  if (!user) return <p className="profile-value">No profile data available</p>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>

      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-field">
            <label>First Name:</label>
            <span>{user.firstName}</span>
          </div>
          <div className="profile-field">
            <label>Last Name:</label>
            <span>{user.lastName}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>
          <div className="profile-field">
            <label>Date of Birth:</label>
            <span>{user.dateOfBirth}</span>
          </div>
          <div className="profile-field">
            <label>Gender:</label>
            <span>{user.gender}</span>
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <span>{user.address}</span>
          </div>
          <div className="profile-field">
            <label>Delivery GPS:</label>
            <span>{user.deliveryGps}</span>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form className="profile-edit" onSubmit={handleSave}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Delivery GPS:</label>
            <input
              type="text"
              name="deliveryGps"
              value={formData.deliveryGps}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
