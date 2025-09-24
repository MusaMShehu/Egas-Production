import React, { useState } from "react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import '../../styles/SignInUp.css'

const LoginModal = ({ onClose, setUser }) => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="sign-container">
      <div className="auth-form">
        
        <div className="tab-header">
          <button className="close-btn" onClick={onClose}>X</button>
          <button
            className={activeTab === "signin" ? "active" : ""}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button 
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "signin" ? (
          <SigninForm setUser={setUser} onClose={onClose} />
        ) : (
          <SignupForm setUser={setUser} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
