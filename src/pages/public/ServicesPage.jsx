import React from 'react';
import {
  Package, Zap, CalendarClock, Truck, Wrench, ShieldCheck,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const SERVICES = [
  {
    icon: <Package size={22} />,
    tag: 'One-time',
    tone: 'primary',
    title: 'Single LPG refill',
    body:
      'Order whenever you need it. Pick a cylinder size, set a delivery address, and pay. Ideal for occasional refills.',
  },
  {
    icon: <Zap size={22} />,
    tag: 'Emergency',
    tone: 'warn',
    title: 'Emergency LPG request',
    body:
      'Ran out mid-cook? request for an emergency delivery and we route it to the nearest available partner plant for priority handling.',
  },
  {
    icon: <CalendarClock size={22} />,
    tag: 'Subscription',
    tone: 'accent',
    title: 'Scheduled subscriptions',
    body:
      'Choose daily, weekly, bi-weekly, or monthly deliveries over a 1–12 month period. Pause, resume, or cancel from your dashboard at any time.',
  },
  {
    icon: <Truck size={22} />,
    tag: 'Delivery',
    tone: 'primary',
    title: 'Doorstep delivery',
    body:
      'We deliver to your saved address. You can track the status of every delivery from your dashboard, from placement to drop-off.',
  },
  {
    icon: <Wrench size={22} />,
    tag: 'Support',
    tone: 'primary',
    title: 'Customer support and service',
    body:
      'Our team are available 24/7 to support you with any gas related service where possible. Reach out to us via our support channel or any of our social media handle',
  },
  {
    icon: <ShieldCheck size={22} />,
    tag: 'Safety',
    tone: 'primary',
    title: 'Safety-checked refills',
    body:
      'Every cylinder is inspected at a partner plant before refilling. Valve, body, and leak integrity are verified and recorded.',
  },
];

export default function ServicesPage() {
  return (
    <section className="egas-section">
      <div className="egas-container">
        <div className="egas-section-head">
          <span className="egas-section-head__eyebrow">Our services</span>
          <h1 className="egas-section-head__title">Everything you need for LPG at home</h1>
          <p className="egas-section-head__sub">
            Order one-off refills, schedule recurring deliveries, or get gas
            urgently when you need it most.
          </p>
        </div>

        <div className="egas-type-grid">
          {SERVICES.map((s) => (
            <Card key={s.title} className="egas-feature">
              <span className={`egas-type__tag egas-type__tag--${s.tone}`}>{s.tag}</span>
              <div className="egas-feature__icon" style={{ marginTop: 12 }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Card>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--sp-9)' }}>
          <Button href="/auth?mode=register" variant="primary" size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}