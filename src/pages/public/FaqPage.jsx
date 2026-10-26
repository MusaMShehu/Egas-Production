import React from 'react';

const SECTIONS = [
  {
    title: 'Ordering',
    items: [
      ['How do I place an order?', 'Create an account, choose your order type (one-time, emergency, or subscription), pick a cylinder size, confirm the address, and pay.'],
      ['Can I order without an account?', 'You need an account so we can save your delivery address, keep your order history, and provide support if something goes wrong.'],
      ['What cylinder sizes are available?', 'We currently deliver 5kg, 6kg, 12.5kg, 25kg, and 50kg cylinders.'],
    ],
  },
  {
    title: 'Delivery',
    items: [
      ['How long does delivery take?', 'Timing depends on the partner plant and your location, but our average delivery time ranges between 2-3 hours on regular delivery for order placed before 4:00pm same day, and 30-45 minutes for emergency delivery any time before 6:00pm. Your dashboard shows the current status of each delivery.'],
      ['Do I need to be home?', 'Yes, the delivery agent needs to hand the cylinder over. If you cannot be there, ensure someone can receive it.'],
      ['Can I track my delivery?', 'Yes. Every order shows a status timeline from placement to delivery.'],
    ],
  },
  {
    title: 'Subscriptions',
    items: [
      ['How do subscriptions work?', 'You choose a delivery frequency (daily, weekly, bi-weekly, or monthly) and a subscription period (1 to 12 months). e-GAS schedules the deliveries automatically.'],
      ['Can I pause my subscription?', 'Yes. Open the subscription and choose Pause. Your remaining time is preserved.'],
      ['Can I cancel?', 'Yes. Cancelling ends future deliveries, and you can contact us for your refund.'],
    ],
  },
  {
    title: 'Payments',
    items: [
      ['What payment methods do you accept?', 'Card payment, bank transfer, USSD and Opay via Paystack, or your e-GAS wallet balance.'],
      ['Is my payment secure?', 'Yes. Payments are processed by Paystack. e-GAS never stores your card details.'],
      ['What if a payment fails?', 'You can retry the payment from your order or wallet page. If the amount was debited but the order didn\u2019t complete, contact support with the reference.'],
    ],
  },
  {
    title: 'Account & Safety',
    items: [
      ['How do I update my details?', 'Open Profile from your dashboard, edit the field you want to change, and save.'],
      ['How do you keep cylinders safe?', 'Every cylinder is inspected at a partner refill plant before refilling, and the delivered LPG is metered by weight.'],
      ['Who do I contact for help?', 'Open a support ticket from your dashboard. That\u2019s the fastest way to reach our team.'],
    ],
  },
];

export default function FaqPage() {
  return (
    <section className="egas-section">
      <div className="egas-container">
        <div className="egas-section-head">
          <span className="egas-section-head__eyebrow">FAQ</span>
          <h1 className="egas-section-head__title">Frequently asked questions</h1>
          <p className="egas-section-head__sub">
            Everything you need to know about ordering cooking gas  with e-GAS.
          </p>
        </div>

        <div className="egas-faq">
          {SECTIONS.map((s) => (
            <div key={s.title} style={{ marginBottom: 'var(--sp-8)' }}>
              <h2 className="egas-h3" style={{ marginBottom: 'var(--sp-3)' }}>{s.title}</h2>
              {s.items.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}