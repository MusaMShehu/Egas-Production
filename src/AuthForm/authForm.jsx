// Single Login/Register Form



// import React, { useState } from "react";
// import API from "../../utils/Api";
// import "../../styles/SignInUp.css";

// const AuthForm = ({ mode = "signin", setUser, onClose }) => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     dob: "",
//     gender: "",
//     state: "",
//     city: "",
//     gps: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [gpsLoading, setGpsLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleGPS = () => {
//     if (navigator.geolocation) {
//       setGpsLoading(true);
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setForm((prev) => ({
//             ...prev,
//             gps: `${pos.coords.latitude}, ${pos.coords.longitude}`,
//           }));
//           setGpsLoading(false);
//         },
//         () => {
//           setError("Failed to get GPS location.");
//           setGpsLoading(false);
//         }
//       );
//     } else {
//       setError("Geolocation not supported on this browser.");
//     }
//   };

//   const validateForm = () => {
//     if (!form.email || !form.password) {
//       setError("Email and password are required.");
//       return false;
//     }
//     if (mode === "signup") {
//       if (!form.firstName || !form.lastName) {
//         setError("First and Last Name are required.");
//         return false;
//       }
//       if (form.password !== form.confirmPassword) {
//         setError("Passwords do not match.");
//         return false;
//       }
//       if (form.password.length < 6) {
//         setError("Password must be at least 6 characters.");
//         return false;
//       }
//     }
//     return true;
//   };

//   const hydrateUser = async (token) => {
//     try {
//       const profileRes = await API.get("/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (profileRes.data?.user) {
//         setUser(profileRes.data.user);
//         localStorage.setItem("user", JSON.stringify(profileRes.data.user));
//       }
//     } catch (err) {
//       console.warn("Could not fetch full profile:", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const endpoint = mode === "signin" ? "/login" : "/register";
//       const { data } = await API.post(endpoint, form);

//       if (!data.token || !data.user) {
//         throw new Error("Invalid response from server");
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setUser(data.user);

//       // hydrate full profile
//       await hydrateUser(data.token);

//       alert(
//         mode === "signin"
//           ? `Welcome back ${data.user.firstName}`
//           : `Welcome ${data.user.firstName}, your account has been created!`
//       );

//       if (onClose) onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Auth failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="sign-container">
//       <form onSubmit={handleSubmit} className="auth-form">
//         {error && <p className="error">{error}</p>}

//         <div className="input-container">
//           {mode === "signup" && (
//             <>
//               <input
//                 type="text"
//                 className="auth-input-field"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={form.firstName}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 className="auth-input-field"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={form.lastName}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="tel"
//                 className="auth-input-field"
//                 name="phone"
//                 placeholder="Phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 className="auth-input-field"
//                 name="address"
//                 placeholder="Address"
//                 value={form.address}
//                 onChange={handleChange}
//               />
//               <input
//                 type="date"
//                 className="auth-input-field"
//                 name="dob"
//                 value={form.dob}
//                 onChange={handleChange}
//               />
//               <select
//                 className="auth-input-field"
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//               <select
//                 className="auth-input-field"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select State</option>
//                 <option value="Borno">Borno</option>
//                 <option value="Yobe">Yobe</option>
//               </select>
//               <input
//                 type="text"
//                 className="auth-input-field"
//                 name="city"
//                 placeholder="City"
//                 value={form.city}
//                 onChange={handleChange}
//               />
//               <button
//                 type="button"
//                 className="gps-button"
//                 onClick={handleGPS}
//                 disabled={gpsLoading}
//               >
//                 {gpsLoading ? "Fetching GPS..." : "Pick GPS Coordinates"}
//               </button>
//               {form.gps && <small>GPS: {form.gps}</small>}
//             </>
//           )}

//           <input
//             type="email"
//             className="auth-input-field"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             className="auth-input-field"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//           {mode === "signup" && (
//             <input
//               type="password"
//               className="auth-input-field"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           )}

//           <button className="auth-button" type="submit" disabled={loading}>
//             {loading
//               ? mode === "signin"
//                 ? "Signing In..."
//                 : "Signing Up..."
//               : mode === "signin"
//               ? "Sign In"
//               : "Sign Up"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AuthForm;











// It updated LoginModal

// import React, { useState } from "react";
// import AuthForm from "./AuthForm";
// import "../../styles/SignInUp.css";

// const LoginModal = ({ onClose, setUser }) => {
//   const [activeTab, setActiveTab] = useState("signin");

//   return (
//     <div className="sign-container">
//       <div className="auth-form">
//         <div className="tab-header">
//           <button className="close-btn" onClick={onClose}>X</button>
//           <button
//             className={activeTab === "signin" ? "active" : ""}
//             onClick={() => setActiveTab("signin")}
//           >
//             Sign In
//           </button>
//           <button
//             className={activeTab === "signup" ? "active" : ""}
//             onClick={() => setActiveTab("signup")}
//           >
//             Sign Up
//           </button>
//         </div>

//         <AuthForm
//           mode={activeTab}
//           setUser={setUser}
//           onClose={onClose}
//         />
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

