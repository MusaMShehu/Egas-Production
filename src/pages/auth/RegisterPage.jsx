// import React, { useMemo, useRef, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Eye, EyeOff, AlertCircle, ChevronLeft, ChevronRight,
//   Upload, MapPin, X, User as UserIcon,
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import Button from '../../components/ui/Button';
// import Input from '../../components/ui/Input';
// import { AuthAside } from './LoginPage';

// const NIGERIAN_STATES = [
//   'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
//   'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe',
//   'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
//   'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
//   'Taraba','Yobe','Zamfara',
// ];

// export default function RegisterPage() {
//   const { register, isLoading, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const redirectTo = useMemo(() => {
//     const params = new URLSearchParams(location.search);
//     return params.get('redirect') || '/dashboard/overview';
//   }, [location.search]);

//   const [step, setStep] = useState(1);
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [showPw, setShowPw] = useState(false);
//   const [showPw2, setShowPw2] = useState(false);
//   const [gps, setGps] = useState(null);
//   const [gpsLoading, setGpsLoading] = useState(false);
//   const [gpsError, setGpsError] = useState('');
//   const fileRef = useRef(null);
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState('');

//   const [form, setForm] = useState({
//     firstName: '', lastName: '', email: '', phone: '',
//     password: '', confirmPassword: '',
//     address: '', city: '', state: '', dob: '', gender: '',
//   });

//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   // If already authed, jump out
//   React.useEffect(() => {
//     if (!isLoading && isAuthenticated) {
//       navigate(redirectTo, { replace: true });
//     }
//   }, [isLoading, isAuthenticated, navigate, redirectTo]);

//   // ---------- Validation per step ----------
//   const validateStep = (s) => {
//     if (s === 1) {
//       if (!form.firstName.trim()) return 'First name is required.';
//       if (!form.lastName.trim())  return 'Last name is required.';
//       if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Enter a valid email address.';
//       if (!/^\+?[0-9]{10,15}$/.test(form.phone.trim().replace(/\s+/g,''))) {
//         return 'Enter a valid phone number (10–15 digits).';
//       }
//     }
//     if (s === 2) {
//       // Matches backend: min 8, upper+lower+digit+special
//       const pw = form.password;
//       if (!pw || pw.length < 8) return 'Password must be at least 8 characters.';
//       if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pw)) {
//         return 'Password must include uppercase, lowercase, a number, and a special character (@$!%*?&).';
//       }
//       if (pw !== form.confirmPassword) return 'Passwords do not match.';
//     }
//     if (s === 3) {
//       if (!form.address.trim()) return 'Address is required.';
//       if (!form.city.trim())    return 'City is required.';
//       if (!form.state)          return 'Please select a state.';
//     }
//     return '';
//   };

//   const next = () => {
//     const msg = validateStep(step);
//     if (msg) { setError(msg); return; }
//     setError('');
//     setStep((s) => Math.min(3, s + 1));
//   };
//   const back = () => { setError(''); setStep((s) => Math.max(1, s - 1)); };

//   // ---------- GPS ----------
//   const detectGps = () => {
//     setGpsError('');
//     if (!navigator.geolocation) {
//       setGpsError('Geolocation is not supported by your browser.');
//       return;
//     }
//     setGpsLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setGps({
//           type: 'Point',
//           coordinates: [pos.coords.longitude, pos.coords.latitude],
//         });
//         setGpsLoading(false);
//       },
//       (err) => {
//         setGpsError(err.message || 'Could not read your location.');
//         setGpsLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   // ---------- Avatar ----------
//   const pickAvatar = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('image/')) {
//       setError('Please choose an image file.');
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setError('Image must be smaller than 5 MB.');
//       return;
//     }
//     setError('');
//     setAvatarFile(file);
//     setAvatarPreview(URL.createObjectURL(file));
//   };
//   const clearAvatar = () => {
//     setAvatarFile(null);
//     setAvatarPreview('');
//     if (fileRef.current) fileRef.current.value = '';
//   };

//   // ---------- Submit ----------
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     // Validate everything before submitting
//     for (let s = 1; s <= 3; s++) {
//       const msg = validateStep(s);
//       if (msg) { setError(msg); setStep(s); return; }
//     }
//     setError('');
//     setSubmitting(true);

//     try {
//       // Build payload that matches backend `register` controller
//       const base = {
//         firstName: form.firstName.trim(),
//         lastName: form.lastName.trim(),
//         email: form.email.trim().toLowerCase(),
//         password: form.password,
//         confirmPassword: form.confirmPassword,
//         phone: form.phone.trim(),
//         address: form.address.trim(),
//         city: form.city.trim(),
//         state: form.state,
//       };
//       if (form.dob) base.dob = form.dob;
//       if (form.gender) base.gender = form.gender;
//       if (gps) base.gps = JSON.stringify(gps);

//       let payload = base;

//       // If a profile image is chosen, send multipart/form-data so the
//       // backend's `profileUpload.single('profileImage')` middleware can read it.
//       if (avatarFile) {
//         const fd = new FormData();
//         Object.entries(base).forEach(([k, v]) => fd.append(k, v));
//         fd.append('profileImage', avatarFile);
//         payload = fd;
//       }

//       const res = await register(payload);

//       if (res?.success === false) {
//         setError(res.message || 'Registration failed.');
//       } else {
//         navigate(redirectTo, { replace: true });
//       }
//     } catch (err) {
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         'Registration failed. Please try again.';
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const busy = submitting || isLoading;

//   return (
//     <div className="egas-auth-shell">
//       <AuthAside />
//       <div className="egas-auth-main">
//         <div className="egas-auth-card">
//           <div className="egas-auth-mobile-brand">
//             <Link to="/" className="egas-logo" aria-label="e-GAS home">
//               <span className="egas-logo__mark" aria-hidden="true">e</span>
//               <span className="egas-logo__word">GAS</span>
//             </Link>
//           </div>

//           <div className="egas-auth-head">
//             <h1 className="egas-auth-head__title">Create your account</h1>
//             <p className="egas-auth-head__sub">
//               Step {step} of 3 — it only takes a minute.
//             </p>
//           </div>

//           <div className="egas-steps-bar" aria-hidden="true">
//             <div className={`egas-steps-bar__seg ${step >= 1 ? (step > 1 ? 'is-done' : 'is-active') : ''}`} />
//             <div className={`egas-steps-bar__seg ${step >= 2 ? (step > 2 ? 'is-done' : 'is-active') : ''}`} />
//             <div className={`egas-steps-bar__seg ${step >= 3 ? 'is-active' : ''}`} />
//           </div>

//           {error && (
//             <div className="egas-auth-error" role="alert" style={{ marginBottom: 'var(--sp-4)' }}>
//               <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//               <span>{error}</span>
//             </div>
//           )}

//           <form className="egas-auth-form" onSubmit={onSubmit} noValidate>
//             {/* -------- STEP 1 -------- */}
//             {step === 1 && (
//               <>
//                 <div className="egas-step-title">Your details</div>
//                 <div className="egas-grid-2">
//                   <Input
//                     label="First name" required name="firstName"
//                     value={form.firstName} onChange={set('firstName')}
//                     autoComplete="given-name" disabled={busy}
//                   />
//                   <Input
//                     label="Last name" required name="lastName"
//                     value={form.lastName} onChange={set('lastName')}
//                     autoComplete="family-name" disabled={busy}
//                   />
//                 </div>
//                 <Input
//                   label="Email address" type="email" required name="email"
//                   value={form.email} onChange={set('email')}
//                   autoComplete="email" placeholder="you@example.com" disabled={busy}
//                 />
//                 <Input
//                   label="Phone number" required name="phone" type="tel"
//                   value={form.phone} onChange={set('phone')}
//                   autoComplete="tel" placeholder="08012345678" disabled={busy}
//                 />
//               </>
//             )}

//             {/* -------- STEP 2 -------- */}
//             {step === 2 && (
//               <>
//                 <div className="egas-step-title">Secure your account</div>

//                 <div className="egas-field">
//                   <label htmlFor="egas-reg-pw" className="egas-label egas-label--required">
//                     Password
//                   </label>
//                   <div className="egas-password-wrap">
//                     <input
//                       id="egas-reg-pw" className="egas-input"
//                       type={showPw ? 'text' : 'password'}
//                       autoComplete="new-password"
//                       value={form.password}
//                       onChange={set('password')} disabled={busy}
//                       placeholder="At least 8 characters"
//                     />
//                     <button type="button" tabIndex={-1}
//                       className="egas-password-toggle"
//                       aria-label={showPw ? 'Hide password' : 'Show password'}
//                       onClick={() => setShowPw((v) => !v)}>
//                       {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                   <span className="egas-helper">
//                     Must contain uppercase, lowercase, a number and a special character.
//                   </span>
//                 </div>

//                 <div className="egas-field">
//                   <label htmlFor="egas-reg-pw2" className="egas-label egas-label--required">
//                     Confirm password
//                   </label>
//                   <div className="egas-password-wrap">
//                     <input
//                       id="egas-reg-pw2" className="egas-input"
//                       type={showPw2 ? 'text' : 'password'}
//                       autoComplete="new-password"
//                       value={form.confirmPassword}
//                       onChange={set('confirmPassword')} disabled={busy}
//                     />
//                     <button type="button" tabIndex={-1}
//                       className="egas-password-toggle"
//                       aria-label={showPw2 ? 'Hide password' : 'Show password'}
//                       onClick={() => setShowPw2((v) => !v)}>
//                       {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* -------- STEP 3 -------- */}
//             {step === 3 && (
//               <>
//                 <div className="egas-step-title">Delivery details</div>

//                 <Input
//                   label="Delivery address" required name="address"
//                   value={form.address} onChange={set('address')}
//                   placeholder="Street, house number, landmark"
//                   autoComplete="street-address" disabled={busy}
//                 />

//                 <div className="egas-grid-2">
//                   <Input
//                     label="City" required name="city"
//                     value={form.city} onChange={set('city')}
//                     autoComplete="address-level2" disabled={busy}
//                   />
//                   <div className="egas-field">
//                     <label htmlFor="egas-reg-state" className="egas-label egas-label--required">State</label>
//                     <select
//                       id="egas-reg-state"
//                       className="egas-select"
//                       value={form.state}
//                       onChange={set('state')}
//                       disabled={busy}
//                     >
//                       <option value="">Select a state</option>
//                       {NIGERIAN_STATES.map((s) => (
//                         <option key={s} value={s}>{s}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="egas-grid-2">
//                   <Input
//                     label="Date of birth (optional)" type="date"
//                     value={form.dob} onChange={set('dob')} disabled={busy}
//                   />
//                   <div className="egas-field">
//                     <label htmlFor="egas-reg-gender" className="egas-label">Gender (optional)</label>
//                     <select
//                       id="egas-reg-gender"
//                       className="egas-select"
//                       value={form.gender}
//                       onChange={set('gender')}
//                       disabled={busy}
//                     >
//                       <option value="">Prefer not to say</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Profile image */}
//                 <div className="egas-field">
//                   <label className="egas-label">Profile picture (optional)</label>
//                   <div className="egas-avatar-upload">
//                     <div className="egas-avatar-upload__preview">
//                       {avatarPreview
//                         ? <img src={avatarPreview} alt="" />
//                         : <UserIcon size={26} />}
//                     </div>
//                     <div style={{ display: 'grid', gap: 6 }}>
//                       <input
//                         ref={fileRef}
//                         type="file"
//                         accept="image/*"
//                         onChange={pickAvatar}
//                         style={{ display: 'none' }}
//                         id="egas-reg-avatar"
//                       />
//                       <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                         <label htmlFor="egas-reg-avatar" className="egas-btn egas-btn--secondary egas-btn--sm">
//                           <Upload size={14} /> Choose image
//                         </label>
//                         {avatarFile && (
//                           <button type="button" className="egas-btn egas-btn--ghost egas-btn--sm" onClick={clearAvatar}>
//                             <X size={14} /> Remove
//                           </button>
//                         )}
//                       </div>
//                       <span className="egas-helper">JPG or PNG · max 5 MB</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Optional GPS */}
//                 <div className="egas-gps-banner">
//                   <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//                   <div style={{ flex: 1 }}>
//                     {gps ? (
//                       <>Location captured — this helps us route your deliveries faster.</>
//                     ) : (
//                       <>
//                         Add your GPS location to speed up delivery routing.{' '}
//                         <button type="button" onClick={detectGps} disabled={gpsLoading}>
//                           {gpsLoading ? 'Reading…' : 'Detect my location'}
//                         </button>
//                       </>
//                     )}
//                     {gpsError && <div style={{ marginTop: 4 }}>{gpsError}</div>}
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* -------- Actions -------- */}
//             <div className="egas-step-actions">
//               {step > 1 ? (
//                 <Button
//                   type="button" variant="secondary"
//                   onClick={back} disabled={busy}
//                   leftIcon={<ChevronLeft size={16} />}
//                 >
//                   Back
//                 </Button>
//               ) : (
//                 <span />
//               )}

//               {step < 3 ? (
//                 <Button
//                   type="button" variant="primary"
//                   onClick={next} disabled={busy}
//                   rightIcon={<ChevronRight size={16} />}
//                 >
//                   Continue
//                 </Button>
//               ) : (
//                 <Button
//                   type="submit" variant="primary"
//                   loading={busy} disabled={busy}
//                 >
//                   Create Account
//                 </Button>
//               )}
//             </div>
//           </form>

//           <div className="egas-auth-foot">
//             Already have an account? <Link to="/auth">Sign in</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






















// components/Auth/RegisterForm.jsx -- full sign-up form (no DOB, no gender)
//   POST /auth/register (multipart). Backend sets HTTP-only cookies; we then call checkAuth().
// Note: AuthContext.register() expects data.user at the top level but the server returns data.data.user,
// so this form calls the API directly and then refreshes auth state instead.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import RegisterLocationField from './RegisterLocationField';
import '../../styles/portal.css';

const PW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function RegisterForm() {
  const nav = useNavigate();
  const { checkAuth } = useAuth();
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '', address: '', city: '', state: '', gps: null });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!/^\+?[0-9]{10,15}$/.test(f.phone)) e.phone = 'Enter a valid phone number (10–15 digits).';
    if (!PW.test(f.password)) e.password = '8+ characters with upper, lower, number and a symbol (@$!%*?&).';
    if (f.password !== f.confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const fd = new FormData();
      ['firstName', 'lastName', 'email', 'phone', 'password', 'address', 'city', 'state'].forEach((k) => fd.append(k, f[k].trim?.() ?? f[k]));
      if (f.gps) fd.append('gps', JSON.stringify(f.gps)); // only present if the user tapped "Use my location"
      await ApiService.auth.register(fd);
      await checkAuth();
      toast.success('Account created. Please verify your email.');
      nav('/dashboard/overview');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally { setBusy(false); }
  };

  return (
    <form className="pt-card pt-auth" onSubmit={submit} noValidate>
      <h1>Create your account</h1>
      <div className="pt-row">
        <input className="pt-input" placeholder="First name" value={f.firstName} onChange={set('firstName')} required autoComplete="given-name" />
        <input className="pt-input" placeholder="Last name" value={f.lastName} onChange={set('lastName')} required autoComplete="family-name" />
      </div>
      <input className="pt-input" type="email" placeholder="Email" value={f.email} onChange={set('email')} required autoComplete="email" />
      <input className="pt-input" type="tel" placeholder="Phone (e.g. 08012345678)" value={f.phone} onChange={set('phone')} required autoComplete="tel" />
      {errors.phone && <p className="pt-error">{errors.phone}</p>}

      <RegisterLocationField value={f} onChange={(patch) => setF((p) => ({ ...p, ...patch }))} />

      <input className="pt-input" type="password" placeholder="Password" value={f.password} onChange={set('password')} required autoComplete="new-password" />
      {errors.password && <p className="pt-error">{errors.password}</p>}
      <input className="pt-input" type="password" placeholder="Confirm password" value={f.confirm} onChange={set('confirm')} required autoComplete="new-password" />
      {errors.confirm && <p className="pt-error">{errors.confirm}</p>}

      <button className="pt-btn pt-btn-primary" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
    </form>
  );
}
