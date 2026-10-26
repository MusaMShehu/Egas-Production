import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authAPI } from '../../api/authAPI';
import { AuthAside } from './LoginPage';

/**
 * Handles both:
 *   /forgot-password            → request a reset link
 *   /reset-password/:token      → set a new password
 *
 * The API layer (authAPI) already knows the exact URLs and payloads.
 */
export default function ForgotPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const mode = token ? 'reset' : 'request';

  // Request state
  const [email, setEmail] = useState('');
  const [reqStatus, setReqStatus] = useState('idle'); // idle | loading | sent | error
  const [reqError, setReqError] = useState('');

  // Reset state
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [resetStatus, setResetStatus] = useState('idle'); // idle | loading | done | error
  const [resetError, setResetError] = useState('');

  const title = useMemo(
    () => (mode === 'reset' ? 'Set a new password' : 'Reset your password'),
    [mode]
  );

  // ---------- Request reset link ----------
  const onRequest = async (e) => {
    e.preventDefault();
    setReqError('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setReqError('Please enter a valid email address.');
      return;
    }
    setReqStatus('loading');
    try {
      const fn =
        authAPI?.forgotPassword ||
        authAPI?.requestPasswordReset ||
        null;
      if (!fn) throw new Error('Password reset API is not available.');

      await fn({ email: email.trim().toLowerCase() });
      setReqStatus('sent');
    } catch (err) {
      setReqStatus('error');
      setReqError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'We could not send the reset email. Please try again.'
      );
    }
  };

  // ---------- Submit new password ----------
  const onReset = async (e) => {
    e.preventDefault();
    setResetError('');
    if (pw1.length < 8) {
      setResetError('Password must be at least 8 characters.');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pw1)) {
      setResetError('Password must include uppercase, lowercase, a number and a special character (@$!%*?&).');
      return;
    }
    if (pw1 !== pw2) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetStatus('loading');
    try {
      const fn =
        authAPI?.resetPassword ||
        authAPI?.resetPasswordWithToken ||
        null;
      if (!fn) throw new Error('Reset API is not available.');

      // Backend: PUT /auth/resetpassword/:resettoken with { password }
      // authAPI.resetPassword may take (token, password) or ({ token, password }).
      // We support both shapes defensively.
      try {
        await fn(token, pw1);
      } catch (firstAttempt) {
        // fallback if the fn expects an object
        await fn({ token, password: pw1 });
      }

      setResetStatus('done');
      setTimeout(() => navigate('/auth', { replace: true }), 1600);
    } catch (err) {
      setResetStatus('error');
      setResetError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Reset link is invalid or has expired.'
      );
    }
  };

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
            <Link to="/auth" className="egas-text--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
            <h1 className="egas-auth-head__title">{title}</h1>
            <p className="egas-auth-head__sub">
              {mode === 'reset'
                ? 'Choose a new password for your e-GAS account.'
                : 'Enter the email you signed up with and we\'ll send a reset link.'}
            </p>
          </div>

          {/* ------------ REQUEST FORM ------------ */}
          {mode === 'request' && (
            <>
              {reqStatus === 'sent' ? (
                <div className="egas-auth-success" role="status">
                  <CheckCircle2 size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
                  If an account exists, a reset link will arrive shortly. Check your inbox and spam folder.
                </div>
              ) : (
                <form className="egas-auth-form" onSubmit={onRequest} noValidate>
                  {reqError && (
                    <div className="egas-auth-error" role="alert">
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{reqError}</span>
                    </div>
                  )}
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={reqStatus === 'loading'}
                  />
                  <Button type="submit" variant="primary" size="lg" block
                    loading={reqStatus === 'loading'}
                    disabled={reqStatus === 'loading'}>
                    Send reset link
                  </Button>
                </form>
              )}
            </>
          )}

          {/* ------------ RESET FORM ------------ */}
          {mode === 'reset' && (
            <>
              {resetStatus === 'done' ? (
                <div className="egas-auth-success" role="status">
                  <CheckCircle2 size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
                  Password updated. Redirecting to sign in…
                </div>
              ) : (
                <form className="egas-auth-form" onSubmit={onReset} noValidate>
                  {resetError && (
                    <div className="egas-auth-error" role="alert">
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div className="egas-field">
                    <label htmlFor="egas-new-pw" className="egas-label egas-label--required">
                      New password
                    </label>
                    <div className="egas-password-wrap">
                      <input
                        id="egas-new-pw"
                        className="egas-input"
                        type={showPw ? 'text' : 'password'}
                        value={pw1}
                        onChange={(e) => setPw1(e.target.value)}
                        autoComplete="new-password"
                        disabled={resetStatus === 'loading'}
                      />
                      <button
                        type="button" tabIndex={-1}
                        className="egas-password-toggle"
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPw((v) => !v)}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Confirm new password"
                    type="password"
                    required
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    autoComplete="new-password"
                    disabled={resetStatus === 'loading'}
                  />

                  <Button type="submit" variant="primary" size="lg" block
                    loading={resetStatus === 'loading'}
                    disabled={resetStatus === 'loading'}>
                    Update password
                  </Button>
                </form>
              )}
            </>
          )}

          <div className="egas-auth-foot">
            Remembered it? <Link to="/auth">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}