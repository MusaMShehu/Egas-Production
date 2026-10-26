import React from 'react';
import { ShieldCheck, Users, Target, Truck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function AboutPage() {
  return (
    <>
      <section className="egas-section">
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">About e-GAS</span>
            <h1 className="egas-section-head__title">
              Making cooking gas accessibility faster, convenient reliable and safer across Nigeria
            </h1>
            <p className="egas-section-head__sub">
              E-GAS ONLINE LIMITED is a digital LPG ordering and doorstep
              delivery platform. We connect households and businesses to a
              network of vetted partner refill plants.
            </p>
          </div>

          <div className="egas-prose" style={{ marginTop: 'var(--sp-9)' }}>
            <h2>Our mission</h2>
            <p>
              To simplify LPG access through technology, dependable delivery and 
              customer-focused service, while building a scalable energy distribution 
              platform that responds to the changing needs of modern consumers.
            </p>

            <h2>How the platform works</h2>
            <p>
              e-GAS is a coordination layer. When you place an order or
              subscription, the platform assign a delivery staff to your order, 
              the delivery staff locate your location through address and gps coordinates 
              provided during registration and collect your cylinder, he then locate closest 
              partner refill plant where your cylinder will be inspected and get refilled.
              after successfull refill your cylinder is then return to you.
              Every step of the operation is recorded, so you can track your delivery and get 
              the exact quantity you paid for, safely and conveniently.
            </p>

            <h2>What we stand for</h2>
            <ul>
              <li><strong>Safety first.</strong> Every cylinder is inspected before refilling.</li>
              <li><strong>Fast.</strong> Our team are fast in response to your order through coordinated operations.</li>
              <li><strong>Transparency.</strong> Cylinders are weighed so you get the LPG you paid for.</li>
              <li><strong>Convenience.</strong> No queues, no guesswork, order from anywhere.</li>
              <li><strong>Reliability.</strong> Scheduled subscriptions, live status, clear records.</li>
            </ul>

            <h2>Customer benefits</h2>
            <ul>
              <li>Order one-time or set up recurring deliveries.</li>
              <li>Emergency requests for when you run out unexpectedly.</li>
              <li>Pay with multiple payment options or from your e-GAS wallet.</li>
              <li>Track every order from placement to delivery.</li>
              <li>Manage subscriptions: pause, resume, or cancel anytime.</li>
            </ul>
          </div>

          <div className="egas-feature-grid" style={{ marginTop: 'var(--sp-9)' }}>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><ShieldCheck size={22} /></div>
              <h3>Safety</h3>
              <p>Recorded inspections and metered refills at every partner plant.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Truck size={22} /></div>
              <h3>Delivery</h3>
              <p>Coordinated doorstep delivery with status tracking.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Users size={22} /></div>
              <h3>Customers</h3>
              <p>Households and small businesses across our service network.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Target size={22} /></div>
              <h3>Focus</h3>
              <p>Reliable LPG delivery, nothing that gets in the way of that.</p>
            </Card>
          </div>

          <div style={{ marginTop: 'var(--sp-9)', textAlign: 'center' }}>
            <Button href="/contact" variant="primary" size="lg">Contact Us</Button>
          </div>
        </div>
      </section>
    </>
  );
}