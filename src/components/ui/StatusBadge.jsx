import React from 'react';
import Badge from './Badge';

/**
 * Maps backend statuses to a tone + human label.
 * Uses the exact enums from the backend; do not invent statuses.
 */
const MAP = {
  // Order / payment
  pending:          { tone: 'warning', label: 'Pending' },
  processing:       { tone: 'info',    label: 'Processing' },
  'in-transit':     { tone: 'info',    label: 'In Transit' },
  completed:        { tone: 'success', label: 'Completed' },
  paid:             { tone: 'success', label: 'Paid' },
  failed:           { tone: 'error',   label: 'Failed' },
  cancelled:        { tone: 'neutral', label: 'Cancelled' },
  delivered:        { tone: 'success', label: 'Delivered' },
  // Delivery
  assigned:         { tone: 'info',    label: 'Assigned' },
  accepted:         { tone: 'info',    label: 'Accepted' },
  out_for_delivery: { tone: 'info',    label: 'Out for Delivery' },
  paused:           { tone: 'warning', label: 'Paused' },
  // Subscription
  active:           { tone: 'success', label: 'Active' },
  expired:          { tone: 'neutral', label: 'Expired' },
  // Support
  open:             { tone: 'info',    label: 'Open' },
  'in-progress':    { tone: 'warning', label: 'In Progress' },
  resolved:         { tone: 'success', label: 'Resolved' },
  closed:           { tone: 'neutral', label: 'Closed' },
};

export default function StatusBadge({ status, children }) {
  if (!status) return null;
  const key = String(status).toLowerCase();
  const cfg = MAP[key] || { tone: 'neutral', label: status };
  return <Badge tone={cfg.tone}>{children || cfg.label}</Badge>;
}