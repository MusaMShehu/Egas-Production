import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/SignInUp.css";
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

const SigninForm = ({ onClose }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!form.email || !form.password) {
      const errorMsg = "Please fill in all fields";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    if (form.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    setLoading(true);
    infoToast("Signing you in...");

    try {
      await login(form.email, form.password);
      successToast("Welcome back! Login successful!");
      
      // Add a small delay before closing to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      
      // Different toast types based on error type
      if (err.message?.includes("network") || err.message?.includes("fetch")) {
        errorToast("Network error. Please check your connection.");
      } else if (err.message?.includes("password") || err.message?.includes("credentials")) {
        errorToast("Invalid email or password. Please try again.");
      } else if (err.message?.includes("email") || err.message?.includes("user")) {
        errorToast("No account found with this email.");
      } else {
        errorToast(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    infoToast("Redirecting to password reset...");
    // You can implement forgot password logic here
    // For now, just show a message
    setTimeout(() => {
      warningToast("Password reset feature coming soon!");
    }, 500);
  };

  const handleFormClose = () => {
    if (!loading) {
      infoToast("Login cancelled");
      onClose();
    }
  };

  const handleClearForm = () => {
    setForm({ email: "", password: "" });
    setError("");
    infoToast("Form cleared");
  };

  const handleDemoCredentials = () => {
    setForm({
      email: "demo@example.com",
      password: "demo123"
    });
    infoToast("Demo credentials filled. Click Sign In to test.");
  };

  return (
    <div className="sign-container">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>

      {/* Demo credentials hint */}
      <div className="demo-hint">
        <button 
          type="button" 
          className="demo-btn"
          onClick={handleDemoCredentials}
          disabled={loading}
        >
          Try Demo Credentials
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
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              id="email"
              className="auth-input-field"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              disabled={loading}
              value={form.email}
            />
          </div>

          <div className="input-group">
            <div className="password-header">
              <label htmlFor="password" className="input-label">Password</label>
              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="password"
              className="auth-input-field"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
              value={form.password}
            />
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="secondary-actions">
              <button
                type="button"
                className="auth-button secondary"
                onClick={handleClearForm}
                disabled={loading}
              >
                Clear
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
            <p>Authenticating...</p>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="security-notice">
        <p>🔒 Your login information is secure and encrypted</p>
      </div>
    </div>
  );
};

export default SigninForm;