import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, RefreshCw } from 'lucide-react';
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { naira, unwrapList } from './apiHelpers';

const TABS = [
  { key: 'all', label: 'All plans' },
  { key: 'preset', label: 'Standard' },
  { key: 'custom', label: 'Custom' },
  { key: 'one-time', label: 'One-time' },
  { key: 'emergency', label: 'Emergency' },
];

export default function PlansPage() {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState({ status: 'loading', plans: [] });
  const [tab, setTab] = useState('all');

  const load = async () => {
    setState({ status: 'loading', plans: [] });
    try {
      const fn =
        ApiService.subscriptionPlans?.getAll ||
        ApiService.subscriptionPlans?.getActive;
      if (!fn) throw new Error('Plans API not available.');
      const res = await fn();
      setState({ status: 'success', plans: unwrapList(res) });
    } catch (err) {
      setState({ status: 'error', plans: [], error: err });
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return state.plans;
    return state.plans.filter((p) => p.type === tab);
  }, [state.plans, tab]);

  return (
    <>
      <PageHeader
        title="Subscription plans"
        subtitle="Choose a delivery schedule that suits your household or business."
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
            onClick={load} disabled={state.status === 'loading'}>
            Refresh
          </Button>
        }
      />

      <div className="egas-tabs" role="tablist" aria-label="Filter plans">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`egas-tab ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {state.status === 'loading' && (
          <div className="egas-grid-cards">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="We couldn't load plans"
            description="Please check your connection and try again."
            onRetry={load}
          />
        )}

        {state.status === 'success' && filtered.length === 0 && (
          <EmptyState
            title="No plans in this category"
            description="Try a different tab, or check back later."
          />
        )}

        {state.status === 'success' && filtered.length > 0 && (
          <div className="egas-grid-cards" style={{ gridTemplateColumns: '1fr' }}>
            {filtered.map((p) => (
              <div key={p._id} className={`egas-plan-card ${p.isPopular ? 'is-popular' : ''}`}>
                {p.isPopular && <span className="egas-plan-card__ribbon">Most popular</span>}

                <div>
                  <h3 className="egas-h4" style={{ margin: 0 }}>{p.name}</h3>
                  <p className="egas-text egas-text--sm" style={{ margin: '4px 0 0' }}>
                    {p.shortDescription || p.description}
                  </p>
                </div>

                <div className="egas-plan-card__price">
                  {p.pricePerKg != null ? (
                    <>
                      {naira(p.pricePerKg)}<small> /kg</small>
                    </>
                  ) : p.basePrice != null ? (
                    <>
                      {naira(p.basePrice)}<small> from</small>
                    </>
                  ) : (
                    <span style={{ fontSize: 'var(--fs-md)' }}>See plan for pricing</span>
                  )}
                </div>

                <div className="egas-plan-card__meta">
                  {p.baseSize && <span>Cylinder: {p.baseSize}</span>}
                  {Array.isArray(p.deliveryFrequency) && p.deliveryFrequency.length > 0 && (
                    <span>Frequencies: {p.deliveryFrequency.join(', ')}</span>
                  )}
                </div>

                <ul className="egas-plan-card__features">
                  {(p.features || []).slice(0, 6).map((f, i) => (
                    <li key={i}>
                      <Check size={14} />
                      {typeof f === 'string' ? f : f.title}
                    </li>
                  ))}
                  {(!p.features || p.features.length === 0) && (
                    <li><Check size={14} /> Available for checkout</li>
                  )}
                </ul>

                <Button
                  href={isAuthenticated ? `/dashboard/order?plan=${p._id}` : `/auth?mode=register&plan=${p._id}`}
                  variant={p.isPopular ? 'primary' : 'secondary'}
                  block
                >
                  {isAuthenticated ? 'Subscribe to this plan' : 'Get started'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <div style={{ textAlign: 'center', marginTop: 'var(--sp-8)' }}>
          <Link to="/auth" className="egas-text--sm" style={{ fontWeight: 'var(--fw-semibold)' }}>
            Already have an account? Sign in
          </Link>
        </div>
      )}
    </>
  );
}