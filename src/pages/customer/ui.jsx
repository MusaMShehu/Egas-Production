// components/User/ui.jsx -- tiny shared kit used by all portal pages
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import '../../styles/portal.css';

// useFetch(fn, deps) -> { data, loading, error, reload }.  fn must return an axios response.
export function useFetch(fn, deps = []) {
  const [s, setS] = useState({ data: null, loading: true, error: '' });
  const run = useCallback(() => {
    setS((p) => ({ ...p, loading: true, error: '' }));
    return fn()
      .then((r) => setS({ data: r.data, loading: false, error: '' }))
      .catch((e) => setS({ data: null, loading: false, error: e.message || 'Something went wrong' }));
    // eslint-disable-next-line
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { ...s, reload: run };
}

// act(promise, okMsg) -> toast feedback, returns true on success
export async function act(promise, okMsg) {
  try { await promise; if (okMsg) toast.success(okMsg); return true; }
  catch (e) { toast.error(e.message || 'Action failed'); return false; }
}

export const Page = ({ title, action, children }) => (
  <div className="pt-page">
    <header className="pt-header"><h1>{title}</h1>{action}</header>
    {children}
  </div>
);

export const State = ({ loading, error, empty, emptyText = 'Nothing here yet.', children }) => {
  if (loading) return <div className="pt-skeleton" aria-busy="true" />;
  if (error) return <div className="pt-card pt-error">{error}</div>;
  if (empty) return <div className="pt-card pt-muted pt-empty">{emptyText}</div>;
  return children;
};

export const Pager = ({ page, pages, onChange }) =>
  pages > 1 ? (
    <div className="pt-pager">
      <button className="pt-btn pt-btn-ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span className="pt-muted">Page {page} of {pages}</span>
      <button className="pt-btn pt-btn-ghost" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  ) : null;

export const Tabs = ({ tabs, value, onChange }) => (
  <div className="pt-tabs" role="tablist">
    {tabs.map((t) => (
      <button key={t.key} role="tab" aria-selected={value === t.key} className={value === t.key ? 'is-active' : ''} onClick={() => onChange(t.key)}>
        {t.label}{t.count !== undefined && <span className="pt-count">{t.count}</span>}
      </button>
    ))}
  </div>
);

export const Badge = ({ status }) => {
  const ok = ['delivered', 'active', 'success', 'completed', 'resolved'].includes(status);
  const bad = ['failed', 'cancelled', 'expired', 'closed'].includes(status);
  return <span className={`pt-badge ${ok ? 'pt-badge-delivered' : bad ? 'pt-badge-failed' : 'pt-badge-pending'}`}>{(status || '').replace(/[-_]/g, ' ')}</span>;
};
