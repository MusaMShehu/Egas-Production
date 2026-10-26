import React, { useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import ApiService from '../../api/apiService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const naira = (n) =>
  n == null ? '—' : `₦${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;

export default function PricingPage() {
  const [state, setState] = useState({ status: 'loading', plans: [], products: [] });

  const load = async () => {
    setState({ status: 'loading', plans: [], products: [] });
    try {
      const [plansRes, productsRes] = await Promise.allSettled([
        ApiService.subscriptionPlans?.getAll?.() ??
          ApiService.subscriptionPlans?.getActive?.() ?? null,
        ApiService.products?.getAll?.() ?? null,
      ]);

      const plans =
        plansRes.status === 'fulfilled' && plansRes.value?.data?.data
          ? plansRes.value.data.data
          : [];

      const products =
        productsRes.status === 'fulfilled' && productsRes.value?.data?.data
          ? productsRes.value.data.data
          : [];

      setState({ status: 'success', plans, products });
    } catch (e) {
      setState({ status: 'error', plans: [], products: [], error: e });
    }
  };

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const byType = { preset: [], custom: [], 'one-time': [], emergency: [] };
    state.plans.forEach((p) => {
      const key = p.type || 'preset';
      (byType[key] ||= []).push(p);
    });
    return byType;
  }, [state.plans]);

  return (
    <section className="egas-section">
      <div className="egas-container">
        <div className="egas-section-head">
          <span className="egas-section-head__eyebrow">Pricing</span>
          <h1 className="egas-section-head__title">Transparent LPG pricing</h1>
          <p className="egas-section-head__sub">
            Prices below are configured by e-GAS operations and reflect current
            LPG rates. Subscriptions are billed per delivery cycle.
          </p>
        </div>

        {state.status === 'loading' && (
          <div className="egas-plan-grid">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="We couldn't load pricing"
            description="Please check your connection and try again."
            onRetry={load}
          />
        )}

        {state.status === 'success' && state.plans.length === 0 && state.products.length === 0 && (
          <EmptyState
            title="Pricing is being updated"
            description="Our team is refreshing the current LPG rates. Please check back shortly."
            actionLabel="Retry"
            onAction={load}
          />
        )}

        {state.status === 'success' && state.plans.length > 0 && (
          <>
            {['preset', 'custom', 'one-time', 'emergency'].map((type) => {
              const list = grouped[type];
              if (!list?.length) return null;

              const heading =
                type === 'preset' ? 'Subscription plans'
                : type === 'custom' ? 'Custom subscription plans'
                : type === 'one-time' ? 'One-time refills'
                : 'Emergency refills';

              return (
                <div key={type} style={{ marginBottom: 'var(--sp-9)' }}>
                  <h2 className="egas-h3" style={{ marginBottom: 'var(--sp-4)' }}>{heading}</h2>
                  <div className="egas-plan-grid">
                    {list.map((plan) => (
                      <div
                        key={plan._id}
                        className={`egas-plan ${plan.isPopular ? 'egas-plan--popular' : ''}`}
                      >
                        {plan.isPopular && <span className="egas-plan__ribbon">Most popular</span>}
                        <h3>{plan.name}</h3>
                        <p className="egas-text egas-text--sm" style={{ margin: 0 }}>
                          {plan.shortDescription || plan.description}
                        </p>

                        <div className="egas-plan__price">
                          {plan.pricePerKg ? (
                            <>
                              {naira(plan.pricePerKg)}
                              <small> /kg</small>
                            </>
                          ) : plan.basePrice ? (
                            <>
                              {naira(plan.basePrice)}
                              <small> base</small>
                            </>
                          ) : (
                            <span style={{ fontSize: 'var(--fs-lg)' }}>See plan</span>
                          )}
                        </div>

                        {plan.baseSize && (
                          <div className="egas-text egas-text--sm">Cylinder: {plan.baseSize}</div>
                        )}

                        <ul className="egas-plan__features">
                          {(plan.features || []).slice(0, 6).map((f, i) => (
                            <li key={i}>
                              <Check size={16} /> {typeof f === 'string' ? f : f.title}
                            </li>
                          ))}
                          {(!plan.features || plan.features.length === 0) && (
                            <li><Check size={16} /> Available for checkout</li>
                          )}
                        </ul>

                        <Button
                          href={`/auth?mode=register&plan=${plan._id}`}
                          variant={plan.isPopular ? 'primary' : 'secondary'}
                          block
                        >
                          Choose plan
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {state.status === 'success' && state.products.length > 0 && (
          <>
            <h2 className="egas-h3" style={{ marginBottom: 'var(--sp-4)' }}>Products &amp; accessories</h2>
            <div className="egas-plan-grid">
              {state.products.slice(0, 12).map((p) => (
                <Card key={p._id} className="egas-feature">
                  <h3>{p.name}</h3>
                  <p className="egas-text egas-text--sm">{p.description}</p>
                  <div className="egas-plan__price">{naira(p.price)}</div>
                </Card>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 'var(--sp-8)' }}>
          <Button variant="ghost" onClick={load} leftIcon={<RefreshCw size={16} />}>
            Refresh pricing
          </Button>
        </div>
      </div>
    </section>
  );
}