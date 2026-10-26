// import React, { useEffect, useRef, useState } from 'react';
// import {
//   User as UserIcon, Upload, X, MapPin, Save, AlertCircle, CheckCircle2,
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import { authAPI } from '../../api/authAPI';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import Input from '../../components/ui/Input';
// import PageHeader from '../../components/ui/PageHeader';
// import { SkeletonCard } from '../../components/ui/Skeleton';

// const NIGERIAN_STATES = [
//   'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
//   'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe',
//   'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
//   'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
//   'Taraba','Yobe','Zamfara',
// ];

// function initialsOf(user) {
//   if (!user) return '?';
//   const f = (user.firstName || '').trim();
//   const l = (user.lastName || '').trim();
//   if (!f && !l) return (user.email || '?').slice(0, 1).toUpperCase();
//   return `${f.slice(0, 1)}${l.slice(0, 1)}`.toUpperCase() || f.slice(0, 1).toUpperCase();
// }

// export default function ProfilePage() {
//   const { user, updateProfile, isLoading } = useAuth();
//   const [form, setForm] = useState(() => blankForm(user));
//   const [gps, setGps] = useState(null);
//   const [gpsLoading, setGpsLoading] = useState(false);
//   const [gpsError, setGpsError] = useState('');
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState('');
//   const [status, setStatus] = useState({ state: 'idle', error: '', success: '' });
//   const [saving, setSaving] = useState(false);
//   const fileRef = useRef(null);

//   // Keep form in sync with user object
//   useEffect(() => { setForm(blankForm(user)); }, [user]);

//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const pickAvatar = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('image/')) {
//       setStatus({ state: 'error', error: 'Please choose an image file.', success: '' });
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setStatus({ state: 'error', error: 'Image must be smaller than 5 MB.', success: '' });
//       return;
//     }
//     setStatus({ state: 'idle', error: '', success: '' });
//     setAvatar(file);
//     setAvatarPreview(URL.createObjectURL(file));
//   };
//   const clearAvatar = () => {
//     setAvatar(null);
//     setAvatarPreview('');
//     if (fileRef.current) fileRef.current.value = '';
//   };

//   const detectGps = () => {
//     setGpsError('');
//     if (!navigator.geolocation) {
//       setGpsError('Geolocation is not supported by your browser.');
//       return;
//     }
//     setGpsLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setGps({ type: 'Point', coordinates: [pos.coords.longitude, pos.coords.latitude] });
//         setGpsLoading(false);
//       },
//       (err) => {
//         setGpsError(err.message || 'Could not read your location.');
//         setGpsLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const onSave = async (e) => {
//     e.preventDefault();
//     setStatus({ state: 'idle', error: '', success: '' });

//     if (!form.firstName.trim() || !form.lastName.trim()) {
//       setStatus({ state: 'error', error: 'First and last name are required.', success: '' });
//       return;
//     }
//     if (!form.phone.trim() || !/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
//       setStatus({ state: 'error', error: 'Enter a valid phone number (10–15 digits).', success: '' });
//       return;
//     }
//     if (!form.address.trim() || !form.city.trim() || !form.state) {
//       setStatus({ state: 'error', error: 'Address, city, and state are required.', success: '' });
//       return;
//     }

//     setSaving(true);
//     try {
//       // Build payload matching backend `updateProfile`
//       const payload = {
//         firstName: form.firstName.trim(),
//         lastName: form.lastName.trim(),
//         phone: form.phone.trim(),
//         address: form.address.trim(),
//         city: form.city.trim(),
//         state: form.state,
//       };
//       if (form.dob) payload.dob = form.dob;
//       if (form.gender) payload.gender = form.gender;
//       if (gps) payload.gpsCoordinates = gps;

//       let res;
//       if (avatar && updateProfile) {
//         // Multipart path — backend uses profileUpload.single('image')
//         const fd = new FormData();
//         Object.entries(payload).forEach(([k, v]) => fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v));
//         fd.append('image', avatar);
//         res = await (authAPI?.updateProfile ? authAPI.updateProfile(fd) : updateProfile(fd));
//       } else {
//         res = await (updateProfile ? updateProfile(payload) : authAPI?.updateProfile?.(payload));
//       }

//       if (res?.success === false) throw new Error(res.message || 'Update failed.');

//       setStatus({ state: 'success', error: '', success: 'Profile updated successfully.' });
//       clearAvatar();
//     } catch (err) {
//       setStatus({
//         state: 'error',
//         error:
//           err?.response?.data?.error ||
//           err?.response?.data?.message ||
//           err?.message ||
//           'Could not save your profile. Please try again.',
//         success: '',
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (isLoading && !user) {
//     return <SkeletonCard />;
//   }

//   const avatarUrl = avatarPreview || user?.profileImage?.secure_url || user?.profileImage?.url || '';

//   return (
//     <>
//       <PageHeader
//         title="My Profile"
//         subtitle="Keep your contact and delivery details up to date."
//       />

//       {/* Overview card */}
//       <div className="egas-profile-hero">
//         <div className="egas-profile-hero__avatar">
//           {avatarUrl ? <img src={avatarUrl} alt="" /> : initialsOf(user)}
//         </div>
//         <div>
//           <h2 className="egas-profile-hero__name">
//             {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer' : 'Customer'}
//           </h2>
//           <p className="egas-profile-hero__email">{user?.email || ''}</p>
//           <div className="egas-profile-hero__meta">
//             {user?.phone && <span><UserIcon size={14} /> {user.phone}</span>}
//             {user?.state && <span><MapPin size={14} /> {user.state}{user.city ? `, ${user.city}` : ''}</span>}
//           </div>
//         </div>
//         <div>
//           <a href="#egas-profile-form" className="egas-btn egas-btn--secondary">
//             Edit details
//           </a>
//         </div>
//       </div>

//       {/* Edit form */}
//       <section id="egas-profile-form" className="egas-dash-section">
//         <Card>
//           <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-5)' }}>
//             Edit details
//           </h2>

//           <form onSubmit={onSave} className="egas-profile-form" noValidate>
//             {/* Avatar upload */}
//             <div className="egas-field">
//               <label className="egas-label">Profile picture</label>
//               <div className="egas-avatar-picker">
//                 <div className="egas-avatar-picker__preview">
//                   {avatarUrl ? <img src={avatarUrl} alt="" /> : <UserIcon size={26} />}
//                 </div>
//                 <div style={{ display: 'grid', gap: 6 }}>
//                   <input
//                     ref={fileRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={pickAvatar}
//                     style={{ display: 'none' }}
//                     id="egas-profile-avatar"
//                   />
//                   <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                     <label htmlFor="egas-profile-avatar" className="egas-btn egas-btn--secondary egas-btn--sm">
//                       <Upload size={14} /> Choose image
//                     </label>
//                     {avatar && (
//                       <button type="button" className="egas-btn egas-btn--ghost egas-btn--sm" onClick={clearAvatar}>
//                         <X size={14} /> Remove
//                       </button>
//                     )}
//                   </div>
//                   <span className="egas-helper">JPG or PNG · max 5 MB</span>
//                 </div>
//               </div>
//             </div>

//             {/* Name */}
//             <div className="egas-profile-form__row">
//               <Input label="First name" required value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
//               <Input label="Last name"  required value={form.lastName}  onChange={set('lastName')}  autoComplete="family-name" />
//             </div>

//             {/* Email (read-only) */}
//             <Input
//               label="Email address"
//               value={user?.email || ''}
//               readOnly
//               helper="Contact support if you need to change your email address."
//             />

//             {/* Phone + DOB */}
//             <div className="egas-profile-form__row">
//               <Input label="Phone number" required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
//               <Input label="Date of birth" type="date" value={form.dob} onChange={set('dob')} />
//             </div>

//             {/* Gender */}
//             <div className="egas-field">
//               <label htmlFor="egas-profile-gender" className="egas-label">Gender</label>
//               <select id="egas-profile-gender" className="egas-select" value={form.gender} onChange={set('gender')}>
//                 <option value="">Prefer not to say</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             {/* Address */}
//             <Input label="Delivery address" required value={form.address} onChange={set('address')} autoComplete="street-address" />
//             <div className="egas-profile-form__row">
//               <Input label="City" required value={form.city} onChange={set('city')} autoComplete="address-level2" />
//               <div className="egas-field">
//                 <label htmlFor="egas-profile-state" className="egas-label egas-label--required">State</label>
//                 <select id="egas-profile-state" className="egas-select" value={form.state} onChange={set('state')}>
//                   <option value="">Select a state</option>
//                   {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* GPS */}
//             <div className="egas-gps-banner">
//               <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//               <div style={{ flex: 1 }}>
//                 {gps ? (
//                   <>Location captured — this helps us route your deliveries faster.</>
//                 ) : (
//                   <>
//                     Update your GPS location.{' '}
//                     <button type="button" onClick={detectGps} disabled={gpsLoading}>
//                       {gpsLoading ? 'Reading…' : 'Detect my location'}
//                     </button>
//                   </>
//                 )}
//                 {gpsError && <div style={{ marginTop: 4 }}>{gpsError}</div>}
//               </div>
//             </div>

//             {/* Feedback */}
//             {status.state === 'error' && (
//               <div className="egas-auth-error" role="alert">
//                 <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//                 <span>{status.error}</span>
//               </div>
//             )}
//             {status.state === 'success' && (
//               <div className="egas-auth-success" role="status">
//                 <CheckCircle2 size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
//                 {status.success}
//               </div>
//             )}

//             {/* Actions */}
//             <div className="egas-profile-actions">
//               <Button type="button" variant="secondary" onClick={() => { setForm(blankForm(user)); setGps(null); clearAvatar(); setStatus({ state: 'idle', error: '', success: '' }); }}>
//                 Cancel changes
//               </Button>
//               <Button type="submit" variant="primary" leftIcon={<Save size={16} />} loading={saving} disabled={saving}>
//                 Save changes
//               </Button>
//             </div>
//           </form>
//         </Card>
//       </section>
//     </>
//   );
// }

// function blankForm(u) {
//   return {
//     firstName: u?.firstName || '',
//     lastName:  u?.lastName  || '',
//     phone:     u?.phone     || '',
//     dob:       u?.dob ? new Date(u.dob).toISOString().slice(0, 10) : '',
//     gender:    u?.gender    || '',
//     address:   u?.address   || '',
//     city:      u?.city      || '',
//     state:     u?.state     || '',
//   };
// }
























import React, { useEffect, useRef, useState } from 'react';
import {
  User as UserIcon, Upload, X, MapPin, Save, AlertCircle, CheckCircle2,
  Phone, Mail, Map, Edit3, Camera, Compass, Shield, Navigation, Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/authAPI';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/Skeleton';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
];

function initialsOf(user) {
  if (!user) return '?';
  const f = (user.firstName || '').trim();
  const l = (user.lastName || '').trim();
  if (!f && !l) return (user.email || '?').slice(0, 1).toUpperCase();
  return `${f.slice(0, 1)}${l.slice(0, 1)}`.toUpperCase() || f.slice(0, 1).toUpperCase();
}

function matchState(rawState) {
  if (!rawState) return '';
  const clean = rawState.replace(' State', '').trim().toLowerCase();
  const found = NIGERIAN_STATES.find(s =>
    s.toLowerCase() === clean ||
    s.toLowerCase().includes(clean) ||
    clean.includes(s.toLowerCase())
  );
  return found || '';
}

function formatCoords(coords) {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) return null;
  const [lng, lat] = coords;
  return `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
}

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => blankForm(user));
  const [gps, setGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [status, setStatus] = useState({ state: 'idle', error: '', success: '' });
  const [saving, setSaving] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setForm(blankForm(user));
  }, [user, isEditing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus({ state: 'error', error: 'Please choose an image file.', success: '' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ state: 'error', error: 'Image must be smaller than 5 MB.', success: '' });
      return;
    }
    setStatus({ state: 'idle', error: '', success: '' });
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const clearAvatar = () => {
    setAvatar(null);
    setAvatarPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const captureLocation = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setGps({ type: 'Point', coordinates: coords });

        // Reverse geocode to auto-fill address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`
          );
          const data = await res.json();
          if (data && data.address) {
            const a = data.address;
            const streetParts = [a.house_number, a.road, a.neighbourhood, a.suburb].filter(Boolean);
            const street = streetParts.join(', ');
            const city = a.city || a.town || a.village || a.county || '';
            const state = matchState(a.state);

            setForm(f => ({
              ...f,
              address: street || f.address,
              city: city || f.city,
              state: state || f.state,
            }));
          }
        } catch (err) {
          console.warn('Reverse geocoding failed', err);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsError(err.message || 'Could not read your location. Please ensure location services are enabled.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCancel = () => {
    setForm(blankForm(user));
    setGps(null);
    clearAvatar();
    setStatus({ state: 'idle', error: '', success: '' });
    setIsEditing(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setStatus({ state: 'idle', error: '', success: '' });

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setStatus({ state: 'error', error: 'First and last name are required.', success: '' });
      return;
    }
    if (!form.phone.trim() || !/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
      setStatus({ state: 'error', error: 'Enter a valid phone number (10–15 digits).', success: '' });
      return;
    }
    if (!form.address.trim() || !form.city.trim() || !form.state) {
      setStatus({ state: 'error', error: 'Address, city, and state are required.', success: '' });
      return;
    }
    if (!gps && !user?.gpsCoordinates) {
      setStatus({ state: 'error', error: 'Please capture your delivery location before saving.', success: '' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state,
      };

      if (gps) payload.gpsCoordinates = gps;

      let res;
      if (avatar && updateProfile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v));
        fd.append('image', avatar);
        res = await (authAPI?.updateProfile ? authAPI.updateProfile(fd) : updateProfile(fd));
      } else {
        res = await (updateProfile ? updateProfile(payload) : authAPI?.updateProfile?.(payload));
      }

      if (res?.success === false) throw new Error(res.message || 'Update failed.');

      setStatus({ state: 'success', error: '', success: 'Profile updated successfully.' });
      clearAvatar();
      setIsEditing(false);
    } catch (err) {
      setStatus({
        state: 'error',
        error:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Could not save your profile. Please try again.',
        success: '',
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !user) {
    return <SkeletonCard />;
  }

  const avatarUrl = avatarPreview || user?.profileImage?.secure_url || user?.profileImage?.url || '';
  const gpsCoords = gps || user?.gpsCoordinates;

  /* ---------------- VIEW MODE ---------------- */
  if (!isEditing) {
    return (
      <>
        <PageHeader
          title="My Profile"
          subtitle="View and manage your personal information."
          actions={
            <Button variant="primary" size="sm" leftIcon={<Edit3 size={14} />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          }
        />

        {status.state === 'success' && (
          <div className="egas-auth-success" role="status" style={{ marginBottom: 'var(--sp-5)' }}>
            <CheckCircle2 size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
            {status.success}
          </div>
        )}

        <div className="egas-profile-hero" style={{ marginBottom: 'var(--sp-6)' }}>
          <div
            className="egas-profile-hero__avatar"
            onClick={() => avatarUrl && setLightboxOpen(true)}
            style={{ cursor: avatarUrl ? 'zoom-in' : 'default', position: 'relative' }}
            role={avatarUrl ? 'button' : undefined}
            aria-label="View profile picture"
          >
            {avatarUrl ? <img src={avatarUrl} alt="" /> : initialsOf(user)}
            {avatarUrl && (
              <div
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                  borderRadius: '50%', display: 'grid', placeItems: 'center',
                  opacity: 0, transition: 'opacity 0.2s'
                }}
                className="hover-overlay"
              >
                <Camera size={22} color="#fff" />
              </div>
            )}
          </div>
          <div>
            <h2 className="egas-profile-hero__name">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer' : 'Customer'}
            </h2>
            <p className="egas-profile-hero__email">{user?.email || ''}</p>
            <div className="egas-profile-hero__meta">
              {user?.phone && <span><Phone size={14} /> {user.phone}</span>}
              {user?.state && <span><MapPin size={14} /> {user.state}{user.city ? `, ${user.city}` : ''}</span>}
            </div>
          </div>
        </div>

        <Card>
          <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-5)' }}>
            Personal Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-6)' }}>
            <InfoField icon={<UserIcon size={16} />} label="Full Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`} />
            <InfoField icon={<Mail size={16} />} label="Email Address" value={user?.email} />
            <InfoField icon={<Phone size={16} />} label="Phone Number" value={user?.phone} />
            <InfoField icon={<Shield size={16} />} label="Account Status" value={user?.emailVerified ? 'Verified' : 'Unverified'} />
          </div>

          <h2 className="egas-dash-section__title" style={{ marginTop: 'var(--sp-8)', marginBottom: 'var(--sp-5)' }}>
            Delivery Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-6)' }}>
            <InfoField icon={<MapPin size={16} />} label="Delivery Address" value={user?.address} />
            <InfoField icon={<Map size={16} />} label="City / State" value={`${user?.city || ''}, ${user?.state || ''}`} />
            <InfoField
              icon={<Compass size={16} />}
              label="GPS Coordinates"
              value={formatCoords(gpsCoords?.coordinates) || 'Not set'}
            />
          </div>
        </Card>

        {avatarUrl && (
          <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} size="lg" footer={null}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-2)' }}>
              <img
                src={avatarUrl}
                alt="Profile"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </Modal>
        )}
      </>
    );
  }

  /* ---------------- EDIT MODE ---------------- */
  return (
    <>
      <PageHeader
        title="Edit Profile"
        subtitle="Update your personal and delivery information."
      />

      <Card>
        <form onSubmit={onSave} noValidate>

          {/* =========================================================
              SECTION 2 — Profile Picture
             ========================================================= */}
          <div className="egas-field" style={{ marginBottom: 'var(--sp-5)' }}>
            <label className="egas-label">Profile Picture</label>
            <div className="egas-avatar-picker">
              <div className="egas-avatar-picker__preview">
                {avatarPreview || avatarUrl ? <img src={avatarPreview || avatarUrl} alt="" /> : <UserIcon size={26} />}
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={pickAvatar}
                  style={{ display: 'none' }}
                  id="egas-profile-avatar"
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <label htmlFor="egas-profile-avatar" className="egas-btn egas-btn--secondary egas-btn--sm">
                    <Upload size={14} /> Change image
                  </label>
                  {(avatar || avatarPreview) && (
                    <button type="button" className="egas-btn egas-btn--ghost egas-btn--sm" onClick={clearAvatar}>
                      <X size={14} /> Remove
                    </button>
                  )}
                </div>
                <span className="egas-helper">JPG or PNG · max 5 MB</span>
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION 3 — Personal Info
             ========================================================= */}
          <div className="egas-profile-form">
            <div className="egas-profile-form__row">
              <Input label="First name" required value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
              <Input label="Last name" required value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
            </div>

            <div className="egas-profile-form__row">
              <Input label="Email address" value={user?.email || ''} readOnly disabled helper="Email cannot be changed." />
              <Input label="Phone number" required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>

             {/* =========================================================
              SECTION 1 — Delivery Location (GPS)
             ========================================================= */}
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <h3 className="egas-h4" style={{ marginTop: 0, marginBottom: 'var(--sp-2)' }}>
              Delivery Location
            </h3>
            <p className="egas-text egas-text--sm" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
              Capture your exact delivery location so our agents can find you faster.
            </p>

            <div style={{
              padding: 'var(--sp-4)',
              border: '1px solid var(--egas-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--egas-bg)',
              display: 'grid',
              gap: 'var(--sp-3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', minWidth: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'var(--egas-primary-light)',
                    color: 'var(--egas-primary)',
                    display: 'grid', placeItems: 'center',
                    flexShrink: 0,
                  }}>
                    <Navigation size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                      {gps || gpsCoords?.coordinates ? 'Location captured' : 'No location captured'}
                    </div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)', marginTop: 2 }}>
                      {formatCoords((gps || gpsCoords)?.coordinates) || 'Tap Capture to add your coordinates'}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={gps ? 'secondary' : 'primary'}
                  size="sm"
                  leftIcon={<MapPin size={14} />}
                  onClick={captureLocation}
                  loading={gpsLoading}
                  disabled={gpsLoading}
                >
                  {gpsLoading
                    ? 'Capturing…'
                    : gps
                      ? 'Recapture Location'
                      : 'Capture Location'}
                </Button>
              </div>

              {/* Note under the capture button */}
              <div style={{
                display: 'flex',
                gap: 8,
                padding: '10px 12px',
                background: 'var(--egas-info-soft)',
                color: 'var(--egas-info)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--fs-sm)',
                lineHeight: 1.5,
              }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  Your gas will be delivered to this address. Please make sure to capture it
                  at your <strong>exact delivery location</strong>.
                </span>
              </div>

              {gpsError && (
                <div className="egas-auth-error" role="alert">
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>
          </div>


            {/* =========================================================
                SECTION 4 — Delivery Address
               ========================================================= */}
            <h3 className="egas-h4" style={{ marginTop: 'var(--sp-4)', marginBottom: 'var(--sp-2)' }}>
              Delivery Address
            </h3>
            <p className="egas-text egas-text--sm" style={{ marginTop: 0, marginBottom: 'var(--sp-2)' }}>
              This address was auto-filled from your captured location, feel free to edit if needed.
            </p>

            <Input label="Delivery address" required value={form.address} onChange={set('address')} autoComplete="street-address" />
            <div className="egas-profile-form__row">
              <Input label="City" required value={form.city} onChange={set('city')} autoComplete="address-level2" />
              <div className="egas-field">
                <label htmlFor="egas-profile-state" className="egas-label egas-label--required">State</label>
                <select id="egas-profile-state" className="egas-select" value={form.state} onChange={set('state')}>
                  <option value="">Select a state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {status.state === 'error' && (
              <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{status.error}</span>
              </div>
            )}

            <div className="egas-profile-actions" style={{ marginTop: 'var(--sp-6)' }}>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Save size={16} />} loading={saving} disabled={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */
function InfoField({ icon, label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--egas-text-muted)', marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 'var(--fs-xs)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 'var(--fs-base)', fontWeight: 500, color: 'var(--egas-text)', wordBreak: 'break-word' }}>
        {value || '—'}
      </div>
    </div>
  );
}

function blankForm(u) {
  return {
    firstName: u?.firstName || '',
    lastName: u?.lastName || '',
    phone: u?.phone || '',
    address: u?.address || '',
    city: u?.city || '',
    state: u?.state || '',
  };
}