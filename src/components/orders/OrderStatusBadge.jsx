import React from 'react';
import Badge from '../ui/Badge';

/**
 * OrderStatusBadge — order-specific status mapping.
 * Falls back gracefully on unknown statuses.
 */

const MAP = {
  // orderStatus
  processing:      { tone: 'info',    label: 'Processing' },
  'in-transit':    { tone: 'info',    label: 'In Transit' },
  delivered:       { tone: 'success', label: 'Delivered' },
  cancelled:       { tone: 'neutral', label: 'Cancelled' },

  // paymentStatus (used for orders without an orderStatus set)
  pending:         { tone: 'warning', label: 'Payment Pending' },
  completed:       { tone: 'success', label: 'Paid' },
  failed:          { tone: 'error',   label: 'Payment Failed' },
  refunded:        { tone: 'neutral', label: 'Refunded' },

  // Delivery enum (occasionally shown on the order card)
  assigned:        { tone: 'info',    label: 'Assigned' },
  accepted:        { tone: 'info',    label: 'Accepted' },
  out_for_delivery:{ tone: 'info',    label: 'Out for Delivery' },
  paused:          { tone: 'warning', label: 'Paused' },
};

export default function OrderStatusBadge({ status, children }) {
  if (!status) return null;
  const key = String(status).toLowerCase();
  const cfg = MAP[key] || { tone: 'neutral', label: status };
  return <Badge tone={cfg.tone}>{children || cfg.label}</Badge>;
}