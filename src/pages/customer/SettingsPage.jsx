import React, { useEffect, useState } from 'react';
import {
  Bell, Shield, Lock, Download, Trash2, AlertCircle, CheckCircle2, Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/authAPI';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/Skeleton';

const TABS = [
  { key: 'general',       label: 'General',       icon: SettingsIcon },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security',      label: 'Security',      icon: Lock },
  { key: 'privacy',       label: 'Privacy',       icon: Shield },
];

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState('general');

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your preferences and account security." />

      <div className="egas-tabs egas-tab-scroll" role="tablist" aria-label="Settings sections">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`egas-tab ${tab === key ? 'is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {tab === 'general'       && <GeneralTab user={user} updateProfile={updateProfile} />}
        {tab === 'notifications' && <NotificationsTab user={user} />}
        {tab === 'security'      && <SecurityTab />}
        {tab === 'privacy'       && <PrivacyTab />}
      </div>
    </>
  );
}

/* ---------- General ---------- */
function GeneralTab({ user }) {
  return (
    <Card>
      <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
        Account overview
      </h2>
      <ul className="egas-summary-list">
        <li><span>Name</span><span>{user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '—'}</span></li>
        <li><span>Email</span><span>{user?.email || '—'}</span></li>
        <li><span>Phone</span><span>{user?.phone || '—'}</span></li>
        <li><span>Role</span><span>{user?.role || 'customer'}</span></li>
      </ul>
      <div style={{ marginTop: 'var(--sp-4)' }}>
        <Button href="/dashboard/profile" variant="secondary">Edit profile details</Button>
      </div>
    </Card>
  );
}

/* ---------- Notifications ---------- */
function NotificationsTab({ user }) {
  const [prefs, setPrefs] = useState({
    orderUpdates: user?.notificationPreferences?.orderUpdates ?? true,
    deliveryNotifications: user?.notificationPreferences?.deliveryNotifications ?? true,
    promotionalOffers: user?.notificationPreferences?.promotionalOffers ?? false,
    newsletter: user?.notificationPreferences?.newsletter ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const toggle = (k) => async () => {
    const next = { ...prefs, [k]: !prefs[k] };
    setPrefs(next);
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await authAPI?.updatePreferences?.(user._id, next);
      if (res?.success === false) throw new Error(res.message || 'Failed to save.');
      setMsg({ type: 'success', text: 'Preferences updated.' });
    } catch (err) {
      setPrefs(prefs);
      setMsg({
        type: 'error',
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Could not save preferences.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-2)' }}>
        Notification preferences
      </h2>
      <p className="egas-text egas-text--sm" style={{ marginBottom: 'var(--sp-4)' }}>
        Choose which notifications you want to receive.
      </p>

      {msg.text && (
        <div className={msg.type === 'success' ? 'egas-auth-success' : 'egas-auth-error'} style={{ marginBottom: 'var(--sp-4)' }}>
          {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span style={{ marginLeft: 6 }}>{msg.text}</span>
        </div>
      )}

      <div className="egas-settings-section">
        <ToggleRow
          title="Order updates"
          desc="Confirmations, status changes, and out-for-delivery alerts."
          checked={prefs.orderUpdates}
          onChange={toggle('orderUpdates')}
          disabled={saving}
        />
        <ToggleRow
          title="Delivery notifications"
          desc="Be notified when a delivery is scheduled or completed."
          checked={prefs.deliveryNotifications}
          onChange={toggle('deliveryNotifications')}
          disabled={saving}
        />
        <ToggleRow
          title="Promotional offers"
          desc="Occasional discounts and special offers."
          checked={prefs.promotionalOffers}
          onChange={toggle('promotionalOffers')}
          disabled={saving}
        />
        <ToggleRow
          title="Newsletter"
          desc="Monthly news, tips, and updates from e-GAS."
          checked={prefs.newsletter}
          onChange={toggle('newsletter')}
          disabled={saving}
        />
      </div>
    </Card>
  );
}

/* ---------- Security ---------- */
function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!form.currentPassword || !form.newPassword) {
      setMsg({ type: 'error', text: 'Please fill in both fields.' });
      return;
    }
    if (form.newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.newPassword)) {
      setMsg({ type: 'error', text: 'Password must be 8+ characters with upper, lower, number, and special character.' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSaving(true);
    try {
      const res = await authAPI?.updatePassword?.({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      if (res?.success === false) throw new Error(res.message || 'Update failed.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMsg({ type: 'success', text: 'Password updated successfully.' });
    } catch (err) {
      setMsg({
        type: 'error',
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Could not update password.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
        Change password
      </h2>

      {msg.text && (
        <div className={msg.type === 'success' ? 'egas-auth-success' : 'egas-auth-error'} style={{ marginBottom: 'var(--sp-4)' }}>
          {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span style={{ marginLeft: 6 }}>{msg.text}</span>
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--sp-4)', maxWidth: 480 }} noValidate>
        <Input label="Current password" type="password" required value={form.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" />
        <Input label="New password" type="password" required value={form.newPassword} onChange={set('newPassword')} autoComplete="new-password" />
        <Input label="Confirm new password" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" loading={saving} disabled={saving}>
            Update password
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* ---------- Privacy ---------- */
function PrivacyTab() {
  const [exporting, setExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const exportData = async () => {
    setExporting(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await ApiService.settings?.exportData?.();
      // Expected: JSON with Content-Disposition. Some environments return the
      // JSON directly; others return a blob. Support both.
      const body = res?.data ?? res;

      if (body && typeof body === 'object' && !(body instanceof Blob)) {
        const blob = new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' });
        downloadBlob(blob, 'egas-personal-data.json');
      } else if (body instanceof Blob) {
        downloadBlob(body, 'egas-personal-data.json');
      } else {
        throw new Error('Export did not return data.');
      }
      setMsg({ type: 'success', text: 'Your data export has been downloaded.' });
    } catch (err) {
      setMsg({
        type: 'error',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Could not export your data. Please try again.',
      });
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await ApiService.settings?.deleteAccount?.();
      // Log out and redirect
      window.location.assign('/auth');
    } catch (err) {
      setMsg({
        type: 'error',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Could not delete your account. Please contact support.',
      });
      setDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
          Privacy & data
        </h2>

        {msg.text && (
          <div className={msg.type === 'success' ? 'egas-auth-success' : 'egas-auth-error'} style={{ marginBottom: 'var(--sp-4)' }}>
            {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span style={{ marginLeft: 6 }}>{msg.text}</span>
          </div>
        )}

        <div className="egas-toggle-row">
          <div>
            <p className="egas-toggle-row__title">Export your data</p>
            <p className="egas-toggle-row__desc">
              Download a copy of your personal data stored with e-GAS.
            </p>
          </div>
          <Button
            variant="secondary"
            leftIcon={<Download size={16} />}
            onClick={exportData}
            loading={exporting}
            disabled={exporting}
          >
            Export
          </Button>
        </div>
      </Card>

      <div className="egas-dash-section">
        <div className="egas-danger-zone">
          <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
            <Trash2 size={20} style={{ color: 'var(--egas-error)', flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--egas-error)' }}>Delete account</div>
              <p className="egas-text egas-text--sm" style={{ marginTop: 4 }}>
                This permanently removes your account and all associated data. This action cannot be undone.
              </p>
              <div style={{ marginTop: 'var(--sp-3)' }}>
                <Button variant="danger" onClick={() => { setDeleteOpen(true); setConfirmText(''); setMsg({ type: '', text: '' }); }}>
                  Delete my account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        title="Delete account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteAccount} loading={deleting} disabled={confirmText !== 'DELETE'}>
              Permanently delete
            </Button>
          </>
        }
      >
        <p className="egas-text">
          This action cannot be undone. To confirm, type <strong>DELETE</strong> in the box below.
        </p>
        <div style={{ marginTop: 'var(--sp-4)' }}>
          <Input
            label="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}

/* ---------- Subcomponents ---------- */
function ToggleRow({ title, desc, checked, onChange, disabled }) {
  return (
    <div className="egas-toggle-row">
      <div>
        <p className="egas-toggle-row__title">{title}</p>
        <p className="egas-toggle-row__desc">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className="egas-switch"
        onClick={onChange}
        disabled={disabled}
      />
    </div>
  );
}

/* ---------- Helpers ---------- */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}