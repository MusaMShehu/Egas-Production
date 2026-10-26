/**
 * Unwraps the existing ApiService response.
 *
 * Because apiClient returns the full axios response, and controllers
 * consistently return `{ success, data, ... }`, the shape we want is
 * almost always `res.data.data`.
 *
 * Fallbacks cover older endpoints that may return the array/object at
 * `res.data` directly.
 */
export function unwrap(res) {
  if (!res) return null;
  const body = res.data ?? res;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
}

export function unwrapList(res) {
  const data = unwrap(res);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

/** ₦ formatter. Never used for calculations — display only. */
export function naira(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `₦${Number(value).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

/** Friendly date formatter — falls back gracefully on invalid input. */
export function formatDate(input, { withTime = false } = {}) {
  if (!input) return '—';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function formatRelative(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hrs  = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);

  const suffix = diff > 0 ? 'from now' : 'ago';
  if (mins < 60) return `${mins} min ${suffix}`;
  if (hrs < 24)  return `${hrs} hr ${suffix}`;
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ${suffix}`;
  return formatDate(input);
}

/** Maps a Delivery.status enum → customer-safe label. */
export function deliveryStatusLabel(status) {
  const map = {
    pending: 'Pending',
    assigned: 'Assigned',
    accepted: 'Accepted',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    failed: 'Failed',
    cancelled: 'Cancelled',
    paused: 'Paused',
  };
  return map[status] || status || '—';
}