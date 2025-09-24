// // src/pages/Login.jsx
// import React, { useState } from "react";
// import './Login.css'

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Send data to backend (example: /api/login)
//     try {
//       const response = await fetch("http://localhost:5000/api/v1/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Login successful ✅");
       
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(response));

//         // localStorage.setItem("token", data.token); // save JWT
//         window.location.href = "/"; // redirect
//       } else {
//         alert(data.message || "Login failed ❌");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="login-Container">
//       <h2>Login</h2>
//       <form className="login-Form" onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         /><br />
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         /><br />
//         <button className="btn"
//         type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;



import React from 'react'
import './Login.css'

const Login = () => {

  // const [currentState, setCurrentState] = useState(false)
  
  return (
    <div className='Login-popup'>
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>

          </h2>
        </div>
      </form>
    </div>
  )
}

export default Login
