import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: reset
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(`Reset token: ${response.data.resetToken}`); // In production, this would be sent via email
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put(`/api/auth/reset-password/${resetToken}`, {
        password: newPassword
      });
      setMessage('Password reset successful! You can now login with your new password.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Reset Password</h2>
        
        {message && <div className="message">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <p>Enter your email address to receive a password reset token.</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <p>Enter the reset token and your new password.</p>
            <input
              type="text"
              placeholder="Reset Token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p>
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;