import React from 'react';
import { Mail, MessageSquare, MapPin, ArrowUpRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function ContactPage() {
  return (
    <section className="egas-section">
      <div className="egas-container">
        <div className="egas-section-head">
          <span className="egas-section-head__eyebrow">Contact</span>
          <h1 className="egas-section-head__title">Talk to e-GAS</h1>
          <p className="egas-section-head__sub">
            Questions about pricing, deliveries, or your account? We&apos;re here to help.
          </p>
        </div>

        <div className="egas-contact-grid">
          <div>
            <Card className="egas-feature" style={{ marginBottom: 'var(--sp-4)' }}>
              <div className="egas-feature__icon"><MessageSquare size={22} /></div>
              <h3>In-app support</h3>
              <p>
                The fastest way to reach us. Create a support ticket from your
                dashboard and track the conversation.
              </p>
              <Button href="/dashboard/support" variant="secondary" size="sm"
                rightIcon={<ArrowUpRight size={14} />}>
                Open support
              </Button>
            </Card>

            <Card className="egas-feature" style={{ marginBottom: 'var(--sp-4)' }}>
              <div className="egas-feature__icon"><Mail size={22} /></div>
              <h3>Email</h3>
              <p>Reach our team at the address listed on your account invoice.</p>
            </Card>

            <Card className="egas-feature">
              <div className="egas-feature__icon"><MapPin size={22} /></div>
              <h3>Location</h3>
              <p>E-GAS ONLINE LIMITED — Nigeria.</p>
            </Card>
          </div>

          <Card>
            <h2 className="egas-h3" style={{ marginTop: 0 }}>Common requests</h2>
            <div className="egas-faq" style={{ marginTop: 'var(--sp-4)' }}>
              <details>
                <summary>My delivery hasn&apos;t arrived</summary>
                <p>Check the order in your dashboard. If the status is still "Out for delivery", our delivery staff is on the way. If it's overdue, open a support ticket from that order.</p>
              </details>
              <details>
                <summary>I paid but didn&apos;t get confirmation</summary>
                <p>Payment verification can take a moment. Refresh your order or wallet page. If the status is still pending after a few minutes, contact support with the transaction reference.</p>
              </details>
              <details>
                <summary>How do I change my delivery address?</summary>
                <p>Go to Profile &rarr; Edit, update the address, and save. Future orders will use the new address.</p>
              </details>
              <details>
                <summary>Can I pause a subscription?</summary>
                <p>Yes. Open the subscription from your dashboard and choose Pause. You can resume it any time.</p>
              </details>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}