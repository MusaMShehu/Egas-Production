import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, CalendarClock, Zap, ShieldCheck, Droplet,
  MapPin, Phone, CreditCard, ArrowRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CYLINDER_SIZES = [
  { kg: 5,    label: '5kg' },
  { kg: 6,    label: '6kg' },
  { kg: 12.5, label: '12.5kg' },
  { kg: 25,   label: '25kg' },
  { kg: 50,   label: '50kg' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="egas-hero">
        <div className="egas-container">
          <div className="egas-hero__grid">
            <div>
              <span className="egas-hero__eyebrow">
                <Droplet size={14} /> Fast, Convenient and Reliable
              </span>
              <h1 className="egas-hero__title">
                Cooking gas <em>delivered</em> to your door.
              </h1>
              <p className="egas-hero__sub">
                Order a one-time LPG refill, request emergency gas, or set up a
                subscription for regular deliveries. e-GAS coordinates with partner
                refill plants to bring safe, metered LPG straight to your home or
                business.
              </p>
              <div className="egas-hero__ctas">
                <Button href="/auth?mode=register" variant="primary" size="lg"
                  rightIcon={<ArrowRight size={16} />}>
                  Order Gas
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  Explore Services
                </Button>
              </div>

              <div className="egas-hero__trust">
                <div><ShieldCheck size={16} /> Safety-checked cylinders</div>
                <div><MapPin size={16} /> Doorstep delivery</div>
                <div><CreditCard size={16} /> Secure payments</div>
              </div>
            </div>

            <div className="egas-hero__visual" aria-hidden="true">
              <div className="egas-hero__card-stack">
                <div className="egas-hero__blob" />
                <img
                  src="/assets/cylinders/hero-cylinder.png"
                  alt=""
                  className="egas-hero__cylinder-img"
                  loading="eager"
                  decoding="async"
                  draggable="false"
                  onError={(e) => {
                    // Graceful fallback: hide the broken image, CSS cylinder
                    // styled blob behind it keeps the layout intact.
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="egas-hero__floating egas-hero__floating--top">
                  <Truck size={16} color="var(--egas-primary)" /> Out for delivery
                </div>
                <div className="egas-hero__floating egas-hero__floating--bottom">
                  <CalendarClock size={16} color="var(--egas-accent)" /> Next Delivery: tomorrow
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY E-GAS */}
      <section className="egas-section">
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">Why e-GAS</span>
            <h2 className="egas-section-head__title">
              A simpler, Fastest and convenient way to refill your cooking gas
            </h2>
            <p className="egas-section-head__sub">
              We remove the queues, the guesswork, and the safety risks so you
              never run out of gas mid-meal.
            </p>
          </div>

          <div className="egas-feature-grid">
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Truck size={22} /></div>
              <h3>Doorstep delivery</h3>
              <p>We deliver to your saved address, no queues at the filling station.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><CalendarClock size={22} /></div>
              <h3>Subscriptions</h3>
              <p>Set a schedule (daily, weekly, bi-weekly, monthly) and we handle the rest.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Zap size={22} /></div>
              <h3>Emergency refills</h3>
              <p>Out of gas right now? Request an emergency refill and we&apos;ll prioritize it.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><ShieldCheck size={22} /></div>
              <h3>Safety-checked</h3>
              <p>Every cylinder is inspected at the partner plant before it reaches you.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Droplet size={22} /></div>
              <h3>Metered LPG</h3>
              <p>Cylinders are weighed so you get the quantity you paid for.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><CreditCard size={22} /></div>
              <h3>Secure payments</h3>
              <p>Pay via Paystack with multiple payment options or top up a wallet for faster checkout.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="egas-section" style={{ background: 'var(--egas-bg)' }}>
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">How it works</span>
            <h2 className="egas-section-head__title">Four steps. That&apos;s it.</h2>
          </div>

          <div className="egas-steps">
            {[
              { t: 'Create your account', d: 'Sign up and save your delivery address.' },
              { t: 'Choose your gas', d: 'Pick a cylinder size, delivery frequency (for subscription), and delivery option.' },
              { t: 'Pay securely', d: 'Pay via Paystack with multiple options or your wallet.' },
              { t: 'Get it delivered', d: 'Track your order and receive it at your door.' },
            ].map((s, i) => (
              <div key={s.t} className="egas-step">
                <span className="egas-step__num">{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER TYPES */}
      <section className="egas-section">
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">Order types</span>
            <h2 className="egas-section-head__title">Choose the way that fits you</h2>
          </div>

          <div className="egas-type-grid">
            <div className="egas-type">
              <span className="egas-type__tag egas-type__tag--primary">One-time</span>
              <h3 className="egas-h4" style={{ margin: '4px 0' }}>Single refill</h3>
              <p className="egas-text">
                Order once whenever you run low. Choose your cylinder size and
                pay as you go.
              </p>
            </div>
            <div className="egas-type">
              <span className="egas-type__tag egas-type__tag--warn">Emergency</span>
              <h3 className="egas-h4" style={{ margin: '4px 0' }}>Emergency refill</h3>
              <p className="egas-text">
                Out of gas right now? select emergency request, choose cylinder size and
                we&apos;ll prioritize it.
              </p>
            </div>
            <div className="egas-type">
              <span className="egas-type__tag egas-type__tag--accent">Subscription</span>
              <h3 className="egas-h4" style={{ margin: '4px 0' }}>Scheduled deliveries</h3>
              <p className="egas-text">
                Set a delivery frequency (daily, weekly, bi-weekly, monthly) and
                pause or resume anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CYLINDER SIZES */}
      <section className="egas-section" style={{ background: 'var(--egas-bg)' }}>
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">Sizes</span>
            <h2 className="egas-section-head__title">Cylinder sizes we deliver</h2>
            <p className="egas-section-head__sub">
              From small household cylinders to larger family and commercial sizes.
            </p>
          </div>

          <div className="egas-size-grid">
            {CYLINDER_SIZES.map(({ kg, label }) => (
              <CylinderSizeCard key={kg} kg={kg} label={label} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--sp-7)' }}>
            <Button href="/pricing" variant="secondary">See pricing</Button>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="egas-section">
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">Safety &amp; trust</span>
            <h2 className="egas-section-head__title">Your safety is the standard</h2>
            <p className="egas-section-head__sub">
              Every e-GAS cylinder passes through a refill plant that
              checks the valve, body, and leak integrity before refilling.
            </p>
          </div>
          <div className="egas-feature-grid">
            <Card className="egas-feature">
              <div className="egas-feature__icon"><ShieldCheck size={22} /></div>
              <h3>Inspection before refill</h3>
              <p>Valves, body, and leak tests are recorded against each cylinder.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><Droplet size={22} /></div>
              <h3>Weighed cylinder</h3>
              <p>Your LPG is metered, the delivered quantity is measured and recorded, 
                not guessed. And your remnant is recorded in your account to be eligible for another delivery if reached 6kg.</p>
            </Card>
            <Card className="egas-feature">
              <div className="egas-feature__icon"><MapPin size={22} /></div>
              <h3>Delivered by vetted delivery staff</h3>
              <p>Delivery staff are tracked through each delivery step.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="egas-section" style={{ background: 'var(--egas-bg)' }}>
        <div className="egas-container">
          <div className="egas-section-head">
            <span className="egas-section-head__eyebrow">FAQ</span>
            <h2 className="egas-section-head__title">Common questions</h2>
          </div>
          <div className="egas-faq">
            <details>
              <summary>How quickly can I get my gas delivered?</summary>
              <p>
                Delivery timing depends on the partner plant and your location.
                e-GAS will assign your request to the nearest available plant,
                and your dashboard shows the current status of your delivery.
              </p>
            </details>
            <details>
              <summary>Can I schedule recurring deliveries?</summary>
              <p>
                Yes. Choose a subscription frequency (daily, weekly, bi-weekly,
                or monthly) and set a subscription duration. You can pause,
                resume, or cancel at any time from your dashboard.
              </p>
            </details>
            <details>
              <summary>What payment methods do you accept?</summary>
              <p>
                You can pay with a debit/credit card, bank tranfer, USSD, and Opay via Paystack, or top up
                your e-GAS wallet and pay from your wallet balance for faster
                checkout.
              </p>
            </details>
            <details>
              <summary>What if I run out of gas right now?</summary>
              <p>
                Place an emergency request from your dashboard. Emergency
                requests are prioritized for the next available delivery slot.
              </p>
            </details>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--sp-7)' }}>
            <Link to="/faq" className="egas-btn egas-btn--ghost">
              See all FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="egas-section">
        <div className="egas-container">
          <div className="egas-cta-band">
            <h2>Never run out of cooking gas again.</h2>
            <p>Create your e-GAS account and place your first order in minutes.</p>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button href="/auth?mode=register" variant="primary" size="lg">
                Create Account
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                See Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="egas-section" style={{ paddingTop: 0 }}>
        <div className="egas-container">
          <div className="egas-feature-grid" style={{ gridTemplateColumns: '1fr' }}>
            <Card className="egas-feature" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--sp-5)' }}>
              <div className="egas-feature__icon"><Phone size={22} /></div>
              <div style={{ flex: 1 }}>
                <h3>Need help choosing?</h3>
                <p>Our support team is one message away. Contact us any time.</p>
              </div>
              <Button href="/contact" variant="secondary">Contact Us</Button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Cylinder size card with image + graceful fallback ---------- */
function CylinderSizeCard({ kg, label }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const src = `/assets/cylinders/${label}.png`;

  return (
    <div className={`egas-size ${imgFailed ? 'is-fallback' : ''}`}>
      {!imgFailed && (
        <img
          src={src}
          alt={`${label} LPG cylinder`}
          className="egas-size__img"
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className="egas-size__kg">
        {String(kg).replace('.0', '')}
        <span className="egas-size__unit">kg</span>
      </div>
      <div className="egas-text" style={{ fontSize: 12, marginTop: 2 }}>
        LPG cylinder
      </div>
    </div>
  );
}