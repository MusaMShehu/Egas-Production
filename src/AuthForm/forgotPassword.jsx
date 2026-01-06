import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: reset
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength checker
  useEffect(() => {
    if (newPassword) {
      const hasLower = /[a-z]/.test(newPassword);
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
      const length = newPassword.length;

      let strength = 'Weak';
      let score = 0;
      
      if (length >= 8) score++;
      if (hasLower) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;

      if (score >= 5) strength = 'Strong';
      else if (score >= 3) strength = 'Medium';
      
      setPasswordStrength(strength);
    } else {
      setPasswordStrength('');
    }
  }, [newPassword]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (step === 1) {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!resetToken.trim()) {
        newErrors.resetToken = 'Reset token is required';
      }
      if (!newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const API_URL = "http://localhost:5000/api/v1/auth";

// Request reset
const handleRequestReset = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const response = await axios.post(`${API_URL}/forgotpassword`, { 
      email,
      redirectUrl: `${window.location.origin}/reset-password`
    });
    
    setMessage({ 
      type: 'success', 
      text: 'Reset instructions sent to your email! Check your inbox.' 
    });
    setStep(2);
    setCountdown(60); // 60 seconds cooldown
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to send reset instructions';
    setMessage({ type: 'error', text: errorMsg });
  } finally {
    setLoading(false);
  }
};

// Reset password
const handleResetPassword = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    await axios.put(`${API_URL}/reset-password`, {
      token: resetToken,
      password: newPassword,
      confirmPassword
    });
    
    setMessage({ 
      type: 'success', 
      text: 'Password reset successful! Redirecting to login...' 
    });
    
    setTimeout(() => {
      window.location.href = '/auth';
    }, 3000);
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to reset password';
    setMessage({ type: 'error', text: errorMsg });
  } finally {
    setLoading(false);
  }
};

// Resend token
const handleResendToken = async () => {
  if (countdown > 0) return;
  
  setLoading(true);
  try {
    await axios.post(`${API_URL}/resend-token`, { email });
    setMessage({ 
      type: 'success', 
      text: 'New reset token sent to your email!' 
    });
    setCountdown(60);
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Failed to resend token';
    setMessage({ type: 'error', text: errorMsg });
  } finally {
    setLoading(false);
  }
};


  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Strong': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>Reset Your Password</h2>
          <p className="subtitle">
            {step === 1 
              ? 'Enter your email to receive reset instructions' 
              : 'Enter reset token and new password'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Request</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Reset</div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Step 1: Request Reset */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || countdown > 0}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
        )}

        {/* Step 2: Reset Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="resetToken">Reset Token</label>
              <div className="token-input-wrapper">
                <input
                  id="resetToken"
                  type="text"
                  placeholder="Enter reset token from email"
                  value={resetToken}
                  onChange={(e) => {
                    setResetToken(e.target.value);
                    if (errors.resetToken) setErrors({...errors, resetToken: ''});
                  }}
                  className={errors.resetToken ? 'error' : ''}
                />
                <button 
                  type="button" 
                  className="btn-resend"
                  onClick={handleResendToken}
                  disabled={loading || countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : 'Resend'}
                </button>
              </div>
              {errors.resetToken && <span className="error-text">{errors.resetToken}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input-wrapper">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password (min. 8 characters)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors({...errors, newPassword: ''});
                  }}
                  className={errors.newPassword ? 'error' : ''}
                />
                <button 
                  type="button" 
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: passwordStrength === 'Weak' ? '33%' : 
                               passwordStrength === 'Medium' ? '66%' : '100%',
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{color: getPasswordStrengthColor()}}>
                    {passwordStrength} Password
                  </span>
                </div>
              )}
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                }}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        <div className="forgot-password-footer">
          <a href="/login" className="back-link">
            ← Back to Login
          </a>
          {step === 2 && (
            <button 
              className="btn-secondary"
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
          )}
        </div>

        {/* Password Requirements */}
        {step === 2 && (
          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={newPassword.length >= 8 ? 'met' : ''}>
                At least 8 characters
              </li>
              <li className={/[a-z]/.test(newPassword) ? 'met' : ''}>
                At least one lowercase letter
              </li>
              <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
                At least one uppercase letter
              </li>
              <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
                At least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'met' : ''}>
                At least one special character
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;