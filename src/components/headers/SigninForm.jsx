import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/SignInUp.css";

const SigninForm = ({ onClose }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      alert(`Welcome back!`);
      onClose();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-container">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        <div className="input-container">
          <input
            className="auth-input-field"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            disabled={loading}
            value={form.email}
          />
          <input
            className="auth-input-field"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
            value={form.password}
          />
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SigninForm;
