import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Truck, CalendarClock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Where to go after login
  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/dashboard/overview';
  }, [location.search]);

  // If already authenticated, bounce to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, redirectTo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      // AuthContext returns either { success: true } or throws
      if (res?.success === false) {
        setError(res.message || 'Invalid credentials.');
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      // Normalize common backend errors
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || isLoading;

  return (
    <div className="egas-auth-shell">
      <AuthAside />
      <div className="egas-auth-main">
        <div className="egas-auth-card">
          <div className="egas-auth-mobile-brand">
            <Link to="/" className="egas-logo" aria-label="e-GAS home">
              <span className="egas-logo__mark" aria-hidden="true">e</span>
              <span className="egas-logo__word">GAS</span>
            </Link>
          </div>

          <div className="egas-auth-head">
            <h1 className="egas-auth-head__title">Welcome back</h1>
            <p className="egas-auth-head__sub">Sign in to continue to your e-GAS account.</p>
          </div>

          {error && (
            <div className="egas-auth-error" role="alert" style={{ marginBottom: 'var(--sp-4)' }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <form className="egas-auth-form" onSubmit={onSubmit} noValidate>
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              disabled={busy}
            />

            <div className="egas-field">
              <label htmlFor="egas-login-password" className="egas-label egas-label--required">
                Password
              </label>
              <div className="egas-password-wrap">
                <input
                  id="egas-login-password"
                  className="egas-input"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  disabled={busy}
                />
                <button
                  type="button"
                  className="egas-password-toggle"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="egas-auth-row">
              <Link to="/forgot-password" className="egas-text--sm">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={busy}
              disabled={busy}
            >
              Sign In
            </Button>
          </form>

          <div className="egas-auth-foot">
            New to e-GAS?{' '}
            <Link to="/auth?mode=register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared left brand panel ---------- */
export function AuthAside() {
  return (
    <aside className="egas-auth-aside" aria-hidden="true">
      <Link to="/" className="egas-auth-aside__logo">
        <span className="egas-logo__mark">e</span>
        <span className="egas-logo__word">GAS</span>
      </Link>

      <h2 className="egas-auth-aside__headline">
        Cooking gas, delivered on your schedule.
      </h2>
      <p className="egas-auth-aside__sub">
        One-time refills, emergency requests, or a recurring subscription —
        e-GAS brings LPG to your door.
      </p>

      <ul className="egas-auth-aside__bullets">
        <li><Truck size={18} /> Doorstep delivery to your saved address</li>
        <li><CalendarClock size={18} /> Subscription plans with pause & resume</li>
        <li><ShieldCheck size={18} /> Safety-checked cylinders at every plant</li>
      </ul>

      <div className="egas-auth-aside__foot">
        © {new Date().getFullYear()} E-GAS ONLINE LIMITED
      </div>
    </aside>
  );
}