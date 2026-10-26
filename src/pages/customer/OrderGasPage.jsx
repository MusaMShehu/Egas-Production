// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import {
//   Package, Zap, Repeat, ChevronLeft, ChevronRight, Check,
//   Wallet, CreditCard, MapPin, AlertCircle, Sparkles,
// } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import { useAuth } from '../../contexts/AuthContext';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import Input from '../../components/ui/Input';
// import PageHeader from '../../components/ui/PageHeader';
// import StatusBadge from '../../components/ui/StatusBadge';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import ErrorState from '../../components/ui/ErrorState';
// import { naira, unwrap, unwrapList } from './apiHelpers';

// const ORDER_TYPES = [
//   { key: 'one-time',    label: 'One-time',    badge: 'primary', icon: Package, desc: 'Order once when you need a refill.' },
//   { key: 'emergency',   label: 'Emergency',   badge: 'warn',    icon: Zap,     desc: 'Out of gas right now? Priority handling.' },
//   { key: 'subscription',label: 'Subscription',badge: 'accent',  icon: Repeat,  desc: 'Recurring deliveries on a schedule you pick.' },
// ];

// const CYLINDER_SIZES = [
//   { kg: 5,    label: '5kg',    hint: 'Small' },
//   { kg: 6,    label: '6kg',    hint: 'Small' },
//   { kg: 12.5, label: '12.5kg', hint: 'Medium' },
//   { kg: 25,   label: '25kg',   hint: 'Family' },
//   { kg: 50,   label: '50kg',   hint: 'Commercial' },
// ];

// const FREQUENCIES = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
// const PERIODS     = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// export default function OrderGasPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const presetPlanId = searchParams.get('plan');

//   const [step, setStep] = useState(1);
//   const [type, setType] = useState('one-time');
//   const [size, setSize] = useState(5);
//   const [frequency, setFrequency] = useState('Weekly');
//   const [period, setPeriod] = useState(1);

//   // Address fields — prefilled from user, editable
//   const [address, setAddress] = useState(user?.address || '');
//   const [city, setCity]       = useState(user?.city || '');
//   const [deliveryOption, setDeliveryOption] = useState('standard');

//   // Payment
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [walletBalance, setWalletBalance] = useState(null);

//   // Data
//   const [plans, setPlans] = useState([]);
//   const [plansStatus, setPlansStatus] = useState('loading');
//   const [selectedPlanId, setSelectedPlanId] = useState(presetPlanId || '');
//   const [submitState, setSubmitState] = useState({ status: 'idle', error: '', order: null, subscription: null });

//   // Load plans (needed for subscriptions and pricing hints)
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const fn = ApiService.subscriptions?.getPlans || ApiService.subscriptionPlans?.getActive;
//         if (!fn) throw new Error('Plans API not available.');
//         const res = await fn();
//         const list = unwrapList(res);
//         if (!alive) return;
//         setPlans(list);
//         setPlansStatus('success');
//         if (presetPlanId) {
//           const match = list.find((p) => p._id === presetPlanId);
//           if (match) {
//             setSelectedPlanId(match._id);
//             setType(match.type === 'one-time' || match.type === 'emergency' ? match.type : 'subscription');
//           }
//         }
//       } catch (err) {
//         if (alive) setPlansStatus('error');
//       }
//     })();
//     return () => { alive = false; };
//   }, [presetPlanId]);

//   // Load wallet balance for the payment step
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const res = await ApiService.payments?.getWalletBalance?.();
//         if (!alive) return;
//         const balance =
//           res?.data?.balance ??
//           unwrap(res)?.balance ??
//           null;
//         setWalletBalance(balance);
//       } catch {
//         if (alive) setWalletBalance(null);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   // Which plan actually matches current selection
//   const selectedPlan = useMemo(() => {
//     if (selectedPlanId) return plans.find((p) => p._id === selectedPlanId) || null;
//     // Fallback: pick first plan compatible with the current type
//     const wantedType =
//       type === 'one-time' ? 'one-time'
//       : type === 'emergency' ? 'emergency'
//       : 'preset';
//     return plans.find((p) => p.type === wantedType) || plans[0] || null;
//   }, [plans, selectedPlanId, type]);

//   const isSubscription = type === 'subscription';

//   const steps = useMemo(() => (
//     isSubscription
//       ? ['Order type', 'Plan & size', 'Schedule', 'Delivery', 'Review & pay']
//       : ['Order type', 'Cylinder', 'Delivery', 'Review & pay']
//   ), [isSubscription]);

//   const totalSteps = steps.length;

//   // ---------- Navigation ----------
//   const next = () => setStep((s) => Math.min(totalSteps, s + 1));
//   const back = () => setStep((s) => Math.max(1, s - 1));

//   // ---------- Submit ----------
//   const submit = async () => {
//     setSubmitState({ status: 'submitting', error: '', order: null, subscription: null });
//     try {
//       if (!address.trim() || !city.trim()) {
//         setSubmitState({ status: 'idle', error: 'Please provide a delivery address and city.', order: null, subscription: null });
//         return;
//       }

//       if (isSubscription) {
//         const planId = selectedPlan?._id;
//         if (!planId) {
//           setSubmitState({ status: 'idle', error: 'Please choose a plan before continuing.', order: null, subscription: null });
//           return;
//         }

//         const payload = {
//           plan: planId,
//           size: `${size}kg`,
//           frequency,
//           subscriptionPeriod: period,
//           paymentMethod,
//         };

//         const res = await ApiService.subscriptions.create(payload);
//         const body = res?.data ?? {};
//         const subscription = body.data ?? unwrap(res);

//         // Paystack returns authorization_url → redirect
//         if (paymentMethod === 'paystack' && (body.authorization_url || res?.data?.authorization_url)) {
//           const url = body.authorization_url || res.data.authorization_url;
//           window.location.assign(url);
//           return;
//         }

//         setSubmitState({ status: 'success', error: '', subscription, order: null });
//         return;
//       }

//       // One-time / emergency → createOrder
//       // The backend expects products: [{ product, quantity }]
//       // We use the selected plan's _id as the product reference OR the selected
//       // physical cylinder size via whichever plan matches; if no product is
//       // exposed, fall back to the plan id (backend validates existence).
//       const productId = selectedPlan?._id;
//       if (!productId) {
//         setSubmitState({ status: 'idle', error: 'No order product is available for this size yet.', order: null, subscription: null });
//         return;
//       }

//       const payload = {
//         products: [{ product: productId, quantity: 1 }],
//         deliveryOption,
//         address: address.trim(),
//         city: city.trim(),
//         paymentMethod,
//       };

//       const res = await ApiService.orders.create(payload);
//       const body = res?.data ?? {};
//       const order = body.data ?? unwrap(res);

//       if (paymentMethod === 'paystack' && (body.authorization_url || res?.data?.authorization_url)) {
//         const url = body.authorization_url || res.data.authorization_url;
//         window.location.assign(url);
//         return;
//       }

//       setSubmitState({ status: 'success', error: '', order, subscription: null });
//     } catch (err) {
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         'We could not start this order. Please try again.';
//       setSubmitState({ status: 'idle', error: msg, order: null, subscription: null });
//     }
//   };

//   // ---------- Success view ----------
//   if (submitState.status === 'success') {
//     return (
//       <>
//         <PageHeader title="Order started" subtitle="We're preparing everything now." />
//         <div className="egas-success-panel">
//           <div className="egas-success-panel__icon"><Check size={28} /></div>
//           <h2>All set!</h2>
//           <p>
//             {submitState.subscription
//               ? 'Your subscription is active. You can manage it any time from your dashboard.'
//               : 'Your order is placed. You can track it from your orders page.'}
//           </p>
//           <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--sp-4)' }}>
//             <Button href="/dashboard/overview" variant="primary">Back to dashboard</Button>
//             {submitState.subscription
//               ? <Button href="/dashboard/subscriptions" variant="secondary">Manage subscription</Button>
//               : <Button href="/dashboard/orders" variant="secondary">View my orders</Button>}
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <PageHeader
//         title="Order Gas"
//         subtitle="Choose the order type that fits you. You can review everything before paying."
//       />

//       {/* Step chips */}
//       <div className="egas-wizard-steps" role="tablist" aria-label="Order steps">
//         {steps.map((label, i) => {
//           const n = i + 1;
//           const cls = n === step ? 'is-active' : n < step ? 'is-done' : '';
//           return (
//             <button
//               key={label}
//               role="tab"
//               aria-selected={n === step}
//               className={`egas-wizard-step ${cls}`}
//               onClick={() => n <= step && setStep(n)}
//               disabled={n > step}
//               type="button"
//             >
//               <span className="egas-wizard-step__num">{n}</span>
//               {label}
//             </button>
//           );
//         })}
//       </div>

//       <div className="egas-wizard">
//         {/* MAIN */}
//         <div className="egas-wizard__main">
//           {/* STEP 1 — ORDER TYPE */}
//           {step === 1 && (
//             <Card>
//               <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
//                 What kind of order is this?
//               </h2>
//               <div className="egas-choice-grid">
//                 {ORDER_TYPES.map(({ key, label, badge, icon: Icon, desc }) => (
//                   <button
//                     key={key}
//                     type="button"
//                     className={`egas-choice ${type === key ? 'is-selected' : ''}`}
//                     onClick={() => { setType(key); if (key !== 'subscription') setSelectedPlanId(''); }}
//                   >
//                     <span className={`egas-choice__badge egas-choice__badge--${badge}`}>{label}</span>
//                     <span className="egas-choice__icon"><Icon size={18} /></span>
//                     <span className="egas-choice__title">{label} order</span>
//                     <span className="egas-choice__desc">{desc}</span>
//                     <span className="egas-choice__check" aria-hidden="true">
//                       {type === key && <Check size={12} />}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* STEP 2 — PLAN & SIZE (subscription) or CYLINDER (one-time) */}
//           {step === 2 && (
//             <>
//               {plansStatus === 'error' && (
//                 <ErrorState
//                   title="We couldn't load available options"
//                   description="Please refresh the page in a moment."
//                 />
//               )}
//               {plansStatus === 'loading' && <SkeletonCard />}

//               {plansStatus === 'success' && (
//                 <Card>
//                   {isSubscription ? (
//                     <>
//                       <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
//                         Choose a plan
//                       </h2>
//                       <div className="egas-choice-grid">
//                         {plans
//                           .filter((p) => p.type === 'preset' || p.type === 'custom')
//                           .map((p) => (
//                             <button
//                               key={p._id}
//                               type="button"
//                               className={`egas-choice ${selectedPlanId === p._id ? 'is-selected' : ''}`}
//                               onClick={() => setSelectedPlanId(p._id)}
//                             >
//                               <span className="egas-choice__title">{p.name}</span>
//                               <span className="egas-choice__desc">
//                                 {p.shortDescription || p.description || 'Subscription plan'}
//                               </span>
//                               {p.pricePerKg != null && (
//                                 <span className="egas-choice__desc">
//                                   {naira(p.pricePerKg)}/kg
//                                 </span>
//                               )}
//                               <span className="egas-choice__check" aria-hidden="true">
//                                 {selectedPlanId === p._id && <Check size={12} />}
//                               </span>
//                             </button>
//                           ))}
//                       </div>

//                       <h2 className="egas-dash-section__title" style={{ marginTop: 'var(--sp-6)', marginBottom: 'var(--sp-3)' }}>
//                         Cylinder size
//                       </h2>
//                       <SizePicker value={size} onChange={setSize} />
//                     </>
//                   ) : (
//                     <>
//                       <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-3)' }}>
//                         Cylinder size
//                       </h2>
//                       <SizePicker value={size} onChange={setSize} />
//                       <p className="egas-text egas-text--sm" style={{ marginTop: 'var(--sp-3)' }}>
//                         Final price will be calculated from the backend when you review the order.
//                       </p>
//                     </>
//                   )}
//                 </Card>
//               )}
//             </>
//           )}

//           {/* STEP 3 — SCHEDULE (subscription only) */}
//           {step === 3 && isSubscription && (
//             <Card>
//               <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
//                 How often should we deliver?
//               </h2>
//               <div className="egas-chip-row">
//                 {FREQUENCIES.map((f) => (
//                   <button
//                     key={f}
//                     type="button"
//                     className={`egas-chip ${frequency === f ? 'is-selected' : ''}`}
//                     onClick={() => setFrequency(f)}
//                   >
//                     {f}
//                   </button>
//                 ))}
//               </div>

//               <h2 className="egas-dash-section__title" style={{ marginTop: 'var(--sp-6)', marginBottom: 'var(--sp-3)' }}>
//                 How long?
//               </h2>
//               <div className="egas-chip-row">
//                 {PERIODS.map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     className={`egas-chip ${period === p ? 'is-selected' : ''}`}
//                     onClick={() => setPeriod(p)}
//                   >
//                     {p} month{p > 1 ? 's' : ''}
//                   </button>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* DELIVERY STEP (one-time: 3, subscription: 4) */}
//           {((isSubscription && step === 4) || (!isSubscription && step === 3)) && (
//             <Card>
//               <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
//                 Where should we deliver?
//               </h2>
//               <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
//                 <Input
//                   label="Street address"
//                   required
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   placeholder="House number, street, landmark"
//                   autoComplete="street-address"
//                 />
//                 <Input
//                   label="City"
//                   required
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   autoComplete="address-level2"
//                 />

//                 <div className="egas-field">
//                   <span className="egas-label">Delivery speed</span>
//                   <div className="egas-chip-row">
//                     <button type="button"
//                       className={`egas-chip ${deliveryOption === 'standard' ? 'is-selected' : ''}`}
//                       onClick={() => setDeliveryOption('standard')}>
//                       Standard
//                     </button>
//                     <button type="button"
//                       className={`egas-chip ${deliveryOption === 'express' ? 'is-selected' : ''}`}
//                       onClick={() => setDeliveryOption('express')}>
//                       Express
//                     </button>
//                   </div>
//                   <span className="egas-helper">
//                     Express may attract an additional delivery fee (shown in summary).
//                   </span>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {/* REVIEW STEP (one-time: 4, subscription: 5) */}
//           {((isSubscription && step === 5) || (!isSubscription && step === 4)) && (
//             <Card>
//               <h2 className="egas-dash-section__title" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
//                 Review &amp; pay
//               </h2>

//               <div className="egas-summary-list" style={{ gap: 'var(--sp-3)' }}>
//                 <ReviewRow label="Order type" value={ORDER_TYPES.find((t) => t.key === type)?.label} />
//                 {isSubscription && <ReviewRow label="Plan" value={selectedPlan?.name || '—'} />}
//                 <ReviewRow label="Cylinder" value={`${size}kg`} />
//                 {isSubscription && <ReviewRow label="Frequency" value={frequency} />}
//                 {isSubscription && <ReviewRow label="Duration" value={`${period} month${period > 1 ? 's' : ''}`} />}
//                 <ReviewRow label="Address" value={`${address}, ${city}`} />
//                 <ReviewRow label="Delivery" value={deliveryOption} />
//               </div>

//               {/* Payment method */}
//               <h3 className="egas-h4" style={{ marginTop: 'var(--sp-6)', marginBottom: 'var(--sp-3)' }}>
//                 Payment method
//               </h3>
//               <div className="egas-pay-grid">
//                 <button type="button"
//                   className={`egas-pay ${paymentMethod === 'paystack' ? 'is-selected' : ''}`}
//                   onClick={() => setPaymentMethod('paystack')}>
//                   <span className="egas-pay__radio" aria-hidden="true" />
//                   <span style={{ flex: 1 }}>
//                     <span className="egas-pay__title">
//                       <CreditCard size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
//                       Card via Paystack
//                     </span>
//                     <span className="egas-pay__desc">
//                       You&apos;ll be redirected to a secure Paystack page.
//                     </span>
//                   </span>
//                 </button>

//                 <button type="button"
//                   className={`egas-pay ${paymentMethod === 'wallet' ? 'is-selected' : ''} ${walletBalance != null && walletBalance <= 0 ? 'is-disabled' : ''}`}
//                   onClick={() => walletBalance > 0 && setPaymentMethod('wallet')}
//                   disabled={walletBalance != null && walletBalance <= 0}>
//                   <span className="egas-pay__radio" aria-hidden="true" />
//                   <span style={{ flex: 1 }}>
//                     <span className="egas-pay__title">
//                       <Wallet size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
//                       e-GAS Wallet
//                     </span>
//                     <span className="egas-pay__desc">
//                       Instantly deduct from your wallet balance.
//                     </span>
//                     {walletBalance != null && (
//                       <span className="egas-pay__balance">
//                         Balance: {naira(walletBalance)}
//                         {walletBalance <= 0 && ' — top up to use this method.'}
//                       </span>
//                     )}
//                   </span>
//                 </button>
//               </div>

//               {submitState.error && (
//                 <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-5)' }}>
//                   <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//                   <span>{submitState.error}</span>
//                 </div>
//               )}
//             </Card>
//           )}

//           {/* NAV BUTTONS */}
//           <div className="egas-wizard-actions">
//             {step > 1 ? (
//               <Button
//                 type="button" variant="secondary"
//                 onClick={back}
//                 leftIcon={<ChevronLeft size={16} />}
//                 disabled={submitState.status === 'submitting'}
//               >
//                 Back
//               </Button>
//             ) : <span />}

//             {step < totalSteps ? (
//               <Button
//                 type="button" variant="primary"
//                 onClick={next}
//                 rightIcon={<ChevronRight size={16} />}
//               >
//                 Continue
//               </Button>
//             ) : (
//               <Button
//                 type="button" variant="primary"
//                 onClick={submit}
//                 loading={submitState.status === 'submitting'}
//                 disabled={submitState.status === 'submitting'}
//               >
//                 {paymentMethod === 'paystack' ? 'Pay with card' : 'Pay with wallet'}
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* ASIDE — LIVE SUMMARY */}
//         <aside className="egas-wizard__aside">
//           <Card className="egas-summary-card">
//             <h3>Order summary</h3>
//             <ul className="egas-summary-list">
//               <li><span>Order type</span><span>{ORDER_TYPES.find((t) => t.key === type)?.label}</span></li>
//               {isSubscription && selectedPlan && <li><span>Plan</span><span>{selectedPlan.name}</span></li>}
//               <li><span>Cylinder</span><span>{size}kg</span></li>
//               {isSubscription && <li><span>Frequency</span><span>{frequency}</span></li>}
//               {isSubscription && <li><span>Duration</span><span>{period} mo</span></li>}
//               <li><span>Delivery</span><span>{deliveryOption}</span></li>
//               <li><span>Payment</span><span>{paymentMethod === 'wallet' ? 'Wallet' : 'Card'}</span></li>
//               <li className="is-total">
//                 <span>Total</span>
//                 <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--egas-text-secondary)' }}>
//                   Calculated at checkout
//                 </span>
//               </li>
//             </ul>
//             <div style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--egas-text-secondary)', fontSize: 'var(--fs-xs)' }}>
//               <MapPin size={14} />
//               {address || user?.address || 'Add a delivery address'} {city ? `· ${city}` : ''}
//             </div>
//             <div style={{ marginTop: 'var(--sp-3)', display: 'flex', gap: 6, alignItems: 'center', color: 'var(--egas-text-muted)', fontSize: 'var(--fs-xs)' }}>
//               <Sparkles size={12} /> Prices are finalized by e-GAS on the server.
//             </div>
//           </Card>
//         </aside>
//       </div>
//     </>
//   );
// }

// /* ---------- Subcomponents ---------- */
// function SizePicker({ value, onChange }) {
//   return (
//     <div className="egas-size-picker">
//       {CYLINDER_SIZES.map(({ kg, label, hint }) => (
//         <button
//           key={kg}
//           type="button"
//           className={`egas-size-option ${value === kg ? 'is-selected' : ''}`}
//           onClick={() => onChange(kg)}
//         >
//           <span className="egas-size-option__kg">{label.replace('kg', '')}<small>kg</small></span>
//           <span className="egas-size-option__hint">{hint}</span>
//         </button>
//       ))}
//     </div>
//   );
// }

// function ReviewRow({ label, value }) {
//   return (
//     <div className="egas-summary-list" style={{ display: 'contents' }}>
//       <li><span>{label}</span><span>{value || '—'}</span></li>
//     </div>
//   );
// }






















// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import {
//   Package, Zap, Repeat, Check, ChevronLeft,
//   CreditCard, Wallet, AlertCircle, Sparkles, Info,
//   Truck, Calendar, PackageCheck, RefreshCw,
// } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import { useAuth } from '../../contexts/AuthContext';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import Input from '../../components/ui/Input';
// import PageHeader from '../../components/ui/PageHeader';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import ErrorState from '../../components/ui/ErrorState';
// import { naira, unwrap, unwrapList } from './apiHelpers';
// import './order-gas-v2.css';

// /* ============================================================
//    CONFIG
//    ============================================================ */
// const ORDER_TYPES = {
//   'one-time': {
//     key: 'one-time',
//     label: 'One-Time Purchase',
//     badge: 'primary',
//     icon: Package,
//     desc: 'Order a cylinder whenever you need a refill.',
//     bullets: ['No commitment', 'Pay once', 'Instant scheduling'],
//   },
//   emergency: {
//     key: 'emergency',
//     label: 'Emergency Order',
//     badge: 'warn',
//     icon: Zap,
//     desc: 'Ran out right now? We route your request for priority handling.',
//     bullets: ['Priority handling', 'Paid once', 'Best-effort dispatch'],
//   },
//   subscription: {
//     key: 'subscription',
//     label: 'Subscription',
//     badge: 'accent',
//     icon: Repeat,
//     desc: 'Recurring deliveries on a schedule you pick.',
//     bullets: ['Basic, Family or Business plan', 'Pause or cancel', 'First delivery included'],
//   },
// };

// const FREQUENCIES = [
//   { value: 'Daily',     label: 'Daily',     short: '1/day' },
//   { value: 'Weekly',    label: 'Weekly',    short: '4/month' },
//   { value: 'Bi-weekly', label: 'Bi-weekly', short: '2/month' },
//   { value: 'Monthly',   label: 'Monthly',   short: '1/month' },
// ];

// const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// /* Canonical delivery count — mirrors backend `calculatePrice` */
// function deliveriesPerMonth(frequency) {
//   switch (frequency) {
//     case 'Daily':     return 30;
//     case 'Weekly':    return 4;
//     case 'Bi-weekly': return 2;
//     case 'Monthly':   return 1;
//     default:          return 1;
//   }
// }

// /**
//  * Compute totals for display. This EXACTLY mirrors
//  * subscriptionController.calculatePrice so the preview matches
//  * what the backend will return. The backend still re-validates
//  * on submit — the frontend never overrides the final amount.
//  */
// function calculateTotals({ plan, sizeKg, frequency, period }) {
//   const pricePerKg = Number(plan?.pricePerKg) || 0;
//   const baseAmount = sizeKg * pricePerKg;

//   if (frequency === 'One-Time' || frequency === 'Emergency') {
//     return {
//       pricePerKg,
//       baseAmount,
//       deliveriesPerMonth: 1,
//       initialDelivery: false,
//       totalDeliveries: 1,
//       totalAmount: Math.round(baseAmount * 1),
//     };
//   }

//   const perMonth = deliveriesPerMonth(frequency);
//   const totalDeliveries =
//     period === 1
//       ? perMonth + 1
//       : (perMonth + 1) + perMonth * (period - 1);

//   return {
//     pricePerKg,
//     baseAmount,
//     deliveriesPerMonth: perMonth,
//     initialDelivery: true,
//     totalDeliveries,
//     totalAmount: Math.round(baseAmount * totalDeliveries),
//   };
// }

// /* ============================================================
//    MAIN PAGE
//    ============================================================ */
// export default function OrderGasPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const presetPlanId = searchParams.get('plan');

//   /* -------- Data -------- */
//   const [plans, setPlans] = useState([]);
//   const [plansStatus, setPlansStatus] = useState('loading');
//   const [walletBalance, setWalletBalance] = useState(null);

//   /* -------- Selections -------- */
//   const [type, setType] = useState(null);              // null → show landing
//   const [sizeKg, setSizeKg] = useState(null);          // number
//   const [selectedPlanId, setSelectedPlanId] = useState(presetPlanId || '');
//   const [frequency, setFrequency] = useState('Weekly');
//   const [period, setPeriod] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState('paystack');

//   /* -------- Delivery -------- */
//   const [address, setAddress] = useState(user?.address || '');
//   const [city, setCity] = useState(user?.city || '');

//   /* -------- Submit -------- */
//   const [submitState, setSubmitState] = useState({
//     status: 'idle', error: '', order: null, subscription: null,
//   });

//   /* -------- Load plans + wallet -------- */
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const fn = ApiService.subscriptionPlans?.getAll
//                 || ApiService.subscriptionPlans?.getActive
//                 || ApiService.subscriptions?.getPlans;
//         if (!fn) throw new Error('Plans API unavailable.');
//         const res = await fn();
//         const list = unwrapList(res);
//         if (!alive) return;
//         setPlans(list);
//         setPlansStatus('success');

//         // Preselect plan if URL param matches
//         if (presetPlanId) {
//           const match = list.find((p) => p._id === presetPlanId);
//           if (match) {
//             setSelectedPlanId(match._id);
//             const isSub = match.type !== 'one-time' && match.type !== 'emergency';
//             setType(isSub ? 'subscription' : match.type);
//           }
//         }
//       } catch {
//         if (alive) setPlansStatus('error');
//       }
//     })();
//     return () => { alive = false; };
//   }, [presetPlanId]);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const res = await ApiService.payments?.getWalletBalance?.();
//         if (!alive) return;
//         setWalletBalance(res?.data?.balance ?? unwrap(res)?.balance ?? null);
//       } catch {
//         if (alive) setWalletBalance(null);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   /* -------- Derived: plans by role -------- */
//   const subscriptionPlans = useMemo(
//     () => plans.filter((p) => p.type === 'preset' || p.type === 'custom'),
//     [plans]
//   );

//   const oneTimePlan = useMemo(
//     () => plans.find((p) => p.type === 'one-time') || null,
//     [plans]
//   );
//   const emergencyPlan = useMemo(
//     () => plans.find((p) => p.type === 'emergency') || null,
//     [plans]
//   );

//   const selectedPlan = useMemo(() => {
//     if (type === 'subscription') {
//       return plans.find((p) => p._id === selectedPlanId) || null;
//     }
//     if (type === 'one-time') return oneTimePlan;
//     if (type === 'emergency') return emergencyPlan;
//     return null;
//   }, [type, plans, selectedPlanId, oneTimePlan, emergencyPlan]);

//   /* -------- Available cylinder sizes for chosen plan -------- */
//   const availableSizes = useMemo(() => {
//     if (!selectedPlan) return [5, 6, 12.5, 25, 50];

//     // Plan supports specific sizes
//     if (Array.isArray(selectedPlan.cylinderSizes) && selectedPlan.cylinderSizes.length > 0) {
//       return selectedPlan.cylinderSizes
//         .map((s) => parseFloat(String(s).replace(/kg/i, '')))
//         .filter((n) => Number.isFinite(n));
//     }

//     // Preset plan with base size only
//     if (selectedPlan.baseSize) {
//       const base = parseFloat(String(selectedPlan.baseSize).replace(/kg/i, ''));
//       if (Number.isFinite(base)) {
//         // Offer the standard ladder but include the base
//         return Array.from(new Set([5, 6, 12.5, 25, 50, base])).sort((a, b) => a - b);
//       }
//     }

//     // Custom plan with range
//     if (selectedPlan.type === 'custom' && selectedPlan.cylinderSizeRange) {
//       const { min, max } = selectedPlan.cylinderSizeRange;
//       return [5, 6, 12.5, 25, 50].filter((n) => n >= min && n <= max);
//     }

//     return [5, 6, 12.5, 25, 50];
//   }, [selectedPlan]);

//   // Reset size if it's not available for the newly selected plan
//   useEffect(() => {
//     if (!availableSizes.includes(sizeKg)) {
//       setSizeKg(availableSizes[0] ?? null);
//     }
//     /* eslint-disable-next-line */
//   }, [selectedPlan?._id]);

//   /* -------- Frequency/period reset for non-subscription -------- */
//   const effectiveFrequency =
//     type === 'one-time' ? 'One-Time'
//     : type === 'emergency' ? 'Emergency'
//     : frequency;

//   const effectivePeriod = type === 'subscription' ? period : 1;

//   /* -------- Live totals -------- */
//   const totals = useMemo(() => {
//     if (!selectedPlan || !sizeKg) return null;
//     return calculateTotals({
//       plan: selectedPlan,
//       sizeKg,
//       frequency: effectiveFrequency,
//       period: effectivePeriod,
//     });
//   }, [selectedPlan, sizeKg, effectiveFrequency, effectivePeriod]);

//   /* -------- Submit -------- */
//   const submit = async () => {
//     setSubmitState({ status: 'submitting', error: '', order: null, subscription: null });

//     if (!selectedPlan) {
//       setSubmitState({ status: 'idle', error: 'Please complete your selection.', order: null, subscription: null });
//       return;
//     }
//     if (!sizeKg) {
//       setSubmitState({ status: 'idle', error: 'Please choose a cylinder size.', order: null, subscription: null });
//       return;
//     }
//     if (!address.trim() || !city.trim()) {
//       setSubmitState({ status: 'idle', error: 'Please provide a delivery address and city.', order: null, subscription: null });
//       return;
//     }

//     try {
//       if (type === 'subscription') {
//         const payload = {
//           plan: selectedPlan._id,
//           size: `${sizeKg}kg`,
//           frequency,
//           subscriptionPeriod: period,
//           paymentMethod,
//         };
//         const res = await ApiService.subscriptions.create(payload);
//         const body = res?.data ?? {};
//         const url = body.authorization_url || unwrap(res)?.authorization_url;
//         if (paymentMethod === 'paystack' && url) {
//           window.location.assign(url);
//           return;
//         }
//         setSubmitState({ status: 'success', error: '', subscription: body.data ?? unwrap(res), order: null });
//         return;
//       }

//       // One-time / emergency → order
//       const payload = {
//         products: [{ product: selectedPlan._id, quantity: 1 }],
//         deliveryOption: 'standard',
//         address: address.trim(),
//         city: city.trim(),
//         paymentMethod,
//       };
//       const res = await ApiService.orders.create(payload);
//       const body = res?.data ?? {};
//       const url = body.authorization_url || unwrap(res)?.authorization_url;
//       if (paymentMethod === 'paystack' && url) {
//         window.location.assign(url);
//         return;
//       }
//       setSubmitState({ status: 'success', error: '', order: body.data ?? unwrap(res), subscription: null });
//     } catch (err) {
//       setSubmitState({
//         status: 'idle',
//         error:
//           err?.response?.data?.error ||
//           err?.response?.data?.message ||
//           err?.message ||
//           'We could not start this order. Please try again.',
//         order: null,
//         subscription: null,
//       });
//     }
//   };

//   /* ============================================================
//      SUCCESS VIEW
//      ============================================================ */
//   if (submitState.status === 'success') {
//     const isSub = !!submitState.subscription;
//     return (
//       <>
//         <PageHeader title="Order started" subtitle="We're preparing everything now." />
//         <div className="egas-og-success">
//           <div className="egas-og-success__icon"><Check size={32} /></div>
//           <h2>{isSub ? 'Subscription active' : 'Order placed'}</h2>
//           <p>
//             {isSub
//               ? 'Your subscription is active. Manage deliveries any time from your dashboard.'
//               : 'Your order is confirmed. Track it from your orders page.'}
//           </p>
//           <div className="egas-og-success__actions">
//             <Button href="/dashboard/overview" variant="primary">Back to dashboard</Button>
//             <Button
//               href={isSub ? '/dashboard/subscriptions' : '/dashboard/orders'}
//               variant="secondary"
//             >
//               {isSub ? 'Manage subscription' : 'View orders'}
//             </Button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ============================================================
//      LANDING — no type selected
//      ============================================================ */
//   if (!type) {
//     return (
//       <>
//         <PageHeader
//           title="Order Gas"
//           subtitle="Choose how you want your LPG delivered."
//         />

//         {plansStatus === 'loading' && (
//           <div className="egas-og-landing">
//             <SkeletonCard /><SkeletonCard /><SkeletonCard />
//           </div>
//         )}

//         {plansStatus === 'error' && (
//           <ErrorState
//             title="We couldn't load the available plans"
//             description="Please refresh the page in a moment."
//             onRetry={() => window.location.reload()}
//           />
//         )}

//         {plansStatus === 'success' && (
//           <div className="egas-og-landing">
//             {Object.values(ORDER_TYPES).map((t) => {
//               const Icon = t.icon;
//               const startingPrice = t.key === 'subscription'
//                 ? lowestSubscriptionRate(subscriptionPlans)
//                 : t.key === 'one-time'
//                   ? oneTimePlan?.pricePerKg
//                   : emergencyPlan?.pricePerKg;

//               return (
//                 <button
//                   key={t.key}
//                   type="button"
//                   className="egas-og-tile"
//                   onClick={() => setType(t.key)}
//                 >
//                   <span className={`egas-og-tile__badge egas-og-tile__badge--${t.badge}`}>
//                     {t.label}
//                   </span>
//                   <span className="egas-og-tile__icon"><Icon size={20} /></span>
//                   <h2 className="egas-og-tile__title">{t.label}</h2>
//                   <p className="egas-og-tile__desc">{t.desc}</p>
//                   <ul className="egas-og-tile__bullets">
//                     {t.bullets.map((b) => (
//                       <li key={b}><Check size={12} /> {b}</li>
//                     ))}
//                   </ul>
//                   <div className="egas-og-tile__cta">
//                     <span>
//                       {startingPrice
//                         ? `From ${naira(startingPrice)} / kg`
//                         : 'Choose options'}
//                     </span>
//                     <span>→</span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         <p className="egas-text--sm" style={{ textAlign: 'center', marginTop: 'var(--sp-6)', color: 'var(--egas-text-secondary)' }}>
//           All prices are calculated and validated by e-GAS on the server.
//         </p>
//       </>
//     );
//   }

//   /* ============================================================
//      CONFIGURATOR — type selected
//      ============================================================ */
//   const t = ORDER_TYPES[type];
//   const isSub = type === 'subscription';

//   return (
//     <>
//       <PageHeader
//         title={t.label}
//         subtitle={t.desc}
//         actions={
//           <Button
//             variant="ghost"
//             size="sm"
//             leftIcon={<ChevronLeft size={14} />}
//             onClick={() => {
//               setType(null);
//               setSelectedPlanId('');
//               setSizeKg(null);
//             }}
//           >
//             Change order type
//           </Button>
//         }
//       />

//       <div className="egas-og-config">
//         {/* ---------------- MAIN ---------------- */}
//         <div className="egas-og-config__main">

//           {/* Plan selector (subscription only) */}
//           {isSub && (
//             <section className="egas-og-section">
//               <div className="egas-og-section__head">
//                 <h2 className="egas-og-section__title">Choose your plan</h2>
//                 <p className="egas-og-section__hint">Basic, Family or Business</p>
//               </div>

//               {subscriptionPlans.length === 0 ? (
//                 <p className="egas-text--sm">No subscription plans are available right now.</p>
//               ) : (
//                 <div className="egas-og-plans">
//                   {subscriptionPlans.map((p) => {
//                     const selected = selectedPlanId === p._id;
//                     return (
//                       <button
//                         key={p._id}
//                         type="button"
//                         className={`egas-og-plan ${selected ? 'is-selected' : ''}`}
//                         onClick={() => setSelectedPlanId(p._id)}
//                       >
//                         {p.isPopular && <span className="egas-og-plan__badge">Most popular</span>}
//                         <h3 className="egas-og-plan__name">{p.name}</h3>
//                         {p.pricePerKg != null && (
//                           <p className="egas-og-plan__rate">{naira(p.pricePerKg)} / kg</p>
//                         )}
//                         {p.shortDescription && (
//                           <p className="egas-og-plan__desc">{p.shortDescription}</p>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* Cylinder size — all order types */}
//           <section className="egas-og-section">
//             <div className="egas-og-section__head">
//               <h2 className="egas-og-section__title">Cylinder size</h2>
//               <p className="egas-og-section__hint">
//                 {isSub
//                   ? 'Pick the cylinder you want refilled on each delivery'
//                   : 'Pick the cylinder size you need'}
//               </p>
//             </div>
//             <div className="egas-og-sizes">
//               {availableSizes.map((kg) => {
//                 const selected = sizeKg === kg;
//                 const unitPrice = selectedPlan?.pricePerKg
//                   ? Number(selectedPlan.pricePerKg) * kg
//                   : null;
//                 return (
//                   <button
//                     key={kg}
//                     type="button"
//                     className={`egas-og-size ${selected ? 'is-selected' : ''}`}
//                     onClick={() => setSizeKg(kg)}
//                     disabled={!selectedPlan}
//                   >
//                     {selected && (
//                       <span className="egas-og-size__check" aria-hidden="true">
//                         <Check size={12} />
//                       </span>
//                     )}
//                     <span className="egas-og-size__kg">
//                       {kg}<small>kg</small>
//                     </span>
//                     {unitPrice != null && (
//                       <span className="egas-og-size__price">{naira(unitPrice)}</span>
//                     )}
//                     <span className="egas-og-size__hint">
//                       {sizeHint(kg)}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Subscription schedule */}
//           {isSub && (
//             <section className="egas-og-section">
//               <div className="egas-og-section__head">
//                 <h2 className="egas-og-section__title">Delivery frequency</h2>
//                 <p className="egas-og-section__hint">How often we deliver</p>
//               </div>
//               <div className="egas-og-chips">
//                 {FREQUENCIES.map((f) => (
//                   <button
//                     key={f.value}
//                     type="button"
//                     className={`egas-og-chip ${frequency === f.value ? 'is-selected' : ''}`}
//                     onClick={() => setFrequency(f.value)}
//                   >
//                     <Calendar size={12} /> {f.label}
//                     <span style={{ opacity: 0.6 }}>· {f.short}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="egas-og-section__head" style={{ marginTop: 'var(--sp-5)' }}>
//                 <h2 className="egas-og-section__title">Subscription period</h2>
//                 <p className="egas-og-section__hint">How long</p>
//               </div>
//               <div className="egas-og-chips">
//                 {PERIODS.map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     className={`egas-og-chip ${period === p ? 'is-selected' : ''}`}
//                     onClick={() => setPeriod(p)}
//                   >
//                     {p} month{p > 1 ? 's' : ''}
//                   </button>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Delivery address */}
//           <section className="egas-og-section">
//             <div className="egas-og-section__head">
//               <h2 className="egas-og-section__title">Delivery address</h2>
//             </div>
//             <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
//               <Input
//                 label="Street address"
//                 required
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 placeholder="House number, street, landmark"
//                 autoComplete="street-address"
//               />
//               <Input
//                 label="City"
//                 required
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 autoComplete="address-level2"
//               />
//             </div>
//           </section>

//           {/* Payment method */}
//           <section className="egas-og-section">
//             <div className="egas-og-section__head">
//               <h2 className="egas-og-section__title">Payment method</h2>
//             </div>
//             <div className="egas-og-pay">
//               <button
//                 type="button"
//                 className={`egas-og-pay-option ${paymentMethod === 'paystack' ? 'is-selected' : ''}`}
//                 onClick={() => setPaymentMethod('paystack')}
//               >
//                 <span className="egas-og-pay-option__radio" aria-hidden="true" />
//                 <div style={{ flex: 1 }}>
//                   <p className="egas-og-pay-option__title">
//                     <CreditCard size={14} /> Card via Paystack
//                   </p>
//                   <p className="egas-og-pay-option__desc">
//                     You&apos;ll be redirected to a secure Paystack page.
//                   </p>
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 className={`egas-og-pay-option ${paymentMethod === 'wallet' ? 'is-selected' : ''} ${
//                   walletBalance != null && walletBalance <= 0 ? 'is-disabled' : ''
//                 }`}
//                 onClick={() => walletBalance > 0 && setPaymentMethod('wallet')}
//                 disabled={walletBalance != null && walletBalance <= 0}
//               >
//                 <span className="egas-og-pay-option__radio" aria-hidden="true" />
//                 <div style={{ flex: 1 }}>
//                   <p className="egas-og-pay-option__title">
//                     <Wallet size={14} /> e-GAS Wallet
//                   </p>
//                   <p className="egas-og-pay-option__desc">
//                     Instantly deduct from your wallet balance.
//                   </p>
//                   {walletBalance != null && (
//                     <span className="egas-og-pay-option__balance">
//                       Balance: {naira(walletBalance)}
//                       {walletBalance <= 0 && ' — top up to use this method.'}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             </div>

//             {submitState.error && (
//               <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
//                 <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//                 <span>{submitState.error}</span>
//               </div>
//             )}
//           </section>
//         </div>

//         {/* ---------------- ASIDE: LIVE PRICING ---------------- */}
//         <aside className="egas-og-config__aside">
//           <div className="egas-og-pricecard">
//             <div className="egas-og-pricecard__head">
//               <h3 className="egas-og-pricecard__title">Your price</h3>
//               <span className="egas-og-pricecard__live">Live</span>
//             </div>

//             {!selectedPlan || !sizeKg || !totals ? (
//               <p className="egas-text--sm" style={{ margin: 0 }}>
//                 Choose your options to see the price.
//               </p>
//             ) : (
//               <>
//                 <ul className="egas-og-summary">
//                   <li>
//                     <span>Type</span>
//                     <span>{t.label}</span>
//                   </li>
//                   {isSub && (
//                     <li>
//                       <span>Plan</span>
//                       <span>{selectedPlan.name}</span>
//                     </li>
//                   )}
//                   <li>
//                     <span>Cylinder</span>
//                     <span>{sizeKg} kg</span>
//                   </li>
//                   <li>
//                     <span>Rate</span>
//                     <span>{naira(totals.pricePerKg)} / kg</span>
//                   </li>

//                   {isSub && (
//                     <>
//                       <li>
//                         <span>Frequency</span>
//                         <span>{frequency}</span>
//                       </li>
//                       <li>
//                         <span>Period</span>
//                         <span>{period} month{period > 1 ? 's' : ''}</span>
//                       </li>
//                       <li>
//                         <span>Deliveries</span>
//                         <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
//                           {totals.totalDeliveries}
//                           {totals.initialDelivery && (
//                             <span className="egas-og-tag">
//                               <PackageCheck size={10} /> incl. initial
//                             </span>
//                           )}
//                         </span>
//                       </li>
//                     </>
//                   )}

//                   <li>
//                     <span>Subtotal</span>
//                     <span>{naira(totals.baseAmount)}</span>
//                   </li>

//                   <li className="egas-og-summary__total">
//                     <span>Total</span>
//                     <span>{naira(totals.totalAmount)}</span>
//                   </li>
//                 </ul>

//                 {isSub && totals.initialDelivery && (
//                   <p className="egas-og-note" style={{ marginTop: 'var(--sp-3)' }}>
//                     <Info size={12} />
//                     Your first month includes an initial delivery in addition to
//                     your regular schedule.
//                   </p>
//                 )}

//                 <p className="egas-og-note" style={{ marginTop: 'var(--sp-2)' }}>
//                   <Sparkles size={12} />
//                   Final total is calculated and validated by e-GAS at checkout.
//                 </p>
//               </>
//             )}
//           </div>

//           <Button
//             variant="primary"
//             size="lg"
//             block
//             onClick={submit}
//             loading={submitState.status === 'submitting'}
//             disabled={submitState.status === 'submitting' || !selectedPlan || !sizeKg}
//           >
//             {paymentMethod === 'paystack' ? 'Pay with card' : 'Pay with wallet'}
//           </Button>

//           <Button
//             variant="ghost"
//             block
//             leftIcon={<RefreshCw size={14} />}
//             onClick={() => window.location.reload()}
//             disabled={submitState.status === 'submitting'}
//           >
//             Refresh prices
//           </Button>

//           <p className="egas-og-note">
//             <Truck size={12} />
//             Delivery times depend on the partner plant and your location.
//           </p>
//         </aside>
//       </div>
//     </>
//   );
// }

// /* ============================================================
//    HELPERS
//    ============================================================ */
// function lowestSubscriptionRate(subPlans) {
//   if (!Array.isArray(subPlans) || subPlans.length === 0) return null;
//   const rates = subPlans
//     .map((p) => Number(p.pricePerKg))
//     .filter((n) => Number.isFinite(n) && n > 0);
//   return rates.length ? Math.min(...rates) : null;
// }

// function sizeHint(kg) {
//   if (kg <= 6) return 'Small';
//   if (kg <= 12.5) return 'Medium';
//   if (kg <= 25) return 'Family';
//   return 'Commercial';
// }
























// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useSearchParams, Link } from 'react-router-dom';
// import {
//   Package, Zap, Repeat, Check, ChevronLeft,
//   CreditCard, Wallet, AlertCircle, Sparkles, Info,
//   Truck, Calendar, PackageCheck, RefreshCw, MapPin,
// } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import { useAuth } from '../../contexts/AuthContext';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import PageHeader from '../../components/ui/PageHeader';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import ErrorState from '../../components/ui/ErrorState';
// import { naira, unwrap, unwrapList } from './apiHelpers';
// import './order-gas-v2.css';

// /* ============================================================
//    CONFIG
//    ============================================================ */
// const ORDER_TYPES = {
//   'one-time': {
//     key: 'one-time',
//     label: 'One-Time Purchase',
//     badge: 'primary',
//     icon: Package,
//     desc: 'Order a cylinder whenever you need a refill.',
//     bullets: ['No commitment', 'Pay once', 'Instant scheduling'],
//   },
//   emergency: {
//     key: 'emergency',
//     label: 'Emergency Order',
//     badge: 'warn',
//     icon: Zap,
//     desc: 'Ran out right now? We route your request for priority handling.',
//     bullets: ['Priority handling', 'Paid once', 'Best-effort dispatch'],
//   },
//   subscription: {
//     key: 'subscription',
//     label: 'Subscription',
//     badge: 'accent',
//     icon: Repeat,
//     desc: 'Recurring deliveries on a schedule you pick.',
//     bullets: ['Basic, Family or Business plan', 'Pause or cancel', 'First delivery included'],
//   },
// };

// const FREQUENCIES = [
//   { value: 'Daily',     label: 'Daily',     short: '1/day' },
//   { value: 'Weekly',    label: 'Weekly',    short: '4/month' },
//   { value: 'Bi-weekly', label: 'Bi-weekly', short: '2/month' },
//   { value: 'Monthly',   label: 'Monthly',   short: '1/month' },
// ];

// const PERIODS = [1, 2, 3, 6, 12];

// /* Canonical delivery count — mirrors backend `calculatePrice` */
// function deliveriesPerMonth(frequency) {
//   switch (frequency) {
//     case 'Daily':     return 30;
//     case 'Weekly':    return 4;
//     case 'Bi-weekly': return 2;
//     case 'Monthly':   return 1;
//     default:          return 1;
//   }
// }

// /**
//  * Compute totals for display. This EXACTLY mirrors
//  * subscriptionController.calculatePrice so the preview matches
//  * what the backend will return. The backend still re-validates
//  * on submit — the frontend never overrides the final amount.
//  */
// function calculateTotals({ plan, sizeKg, frequency, period }) {
//   const pricePerKg = Number(plan?.pricePerKg) || 0;
//   const baseAmount = sizeKg * pricePerKg;

//   if (frequency === 'One-Time' || frequency === 'Emergency') {
//     return {
//       pricePerKg,
//       baseAmount,
//       deliveriesPerMonth: 1,
//       initialDelivery: false,
//       totalDeliveries: 1,
//       totalAmount: Math.round(baseAmount * 1),
//     };
//   }

//   const perMonth = deliveriesPerMonth(frequency);
//   const totalDeliveries =
//     period === 1
//       ? perMonth + 1
//       : (perMonth + 1) + perMonth * (period - 1);

//   return {
//     pricePerKg,
//     baseAmount,
//     deliveriesPerMonth: perMonth,
//     initialDelivery: true,
//     totalDeliveries,
//     totalAmount: Math.round(baseAmount * totalDeliveries),
//   };
// }

// /* ============================================================
//    MAIN PAGE
//    ============================================================ */
// export default function OrderGasPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const presetPlanId = searchParams.get('plan');

//   /* -------- Data -------- */
//   const [plans, setPlans] = useState([]);
//   const [plansStatus, setPlansStatus] = useState('loading');
//   const [walletBalance, setWalletBalance] = useState(null);

//   /* -------- Selections -------- */
//   const [type, setType] = useState(null);              // null → show landing
//   const [sizeKg, setSizeKg] = useState(null);          // number
//   const [selectedPlanId, setSelectedPlanId] = useState(presetPlanId || '');
//   const [frequency, setFrequency] = useState('Weekly');
//   const [period, setPeriod] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState('paystack');

//   /* -------- Submit -------- */
//   const [submitState, setSubmitState] = useState({
//     status: 'idle', error: '', order: null, subscription: null,
//   });

//   /* -------- Load plans + wallet -------- */
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const fn = ApiService.subscriptionPlans?.getAll
//                 || ApiService.subscriptionPlans?.getActive
//                 || ApiService.subscriptions?.getPlans;
//         if (!fn) throw new Error('Plans API unavailable.');
//         const res = await fn();
//         const list = unwrapList(res);
//         if (!alive) return;
//         setPlans(list);
//         setPlansStatus('success');

//         // Preselect plan if URL param matches
//         if (presetPlanId) {
//           const match = list.find((p) => p._id === presetPlanId);
//           if (match) {
//             setSelectedPlanId(match._id);
//             const isSub = match.type !== 'one-time' && match.type !== 'emergency';
//             setType(isSub ? 'subscription' : match.type);
//           }
//         }
//       } catch {
//         if (alive) setPlansStatus('error');
//       }
//     })();
//     return () => { alive = false; };
//   }, [presetPlanId]);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const res = await ApiService.payments?.getWalletBalance?.();
//         if (!alive) return;
//         setWalletBalance(res?.data?.balance ?? unwrap(res)?.balance ?? null);
//       } catch {
//         if (alive) setWalletBalance(null);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   /* -------- Derived: plans by role -------- */
//   const subscriptionPlans = useMemo(
//     () => plans.filter((p) => p.type === 'preset' || p.type === 'custom'),
//     [plans]
//   );

//   const oneTimePlan = useMemo(
//     () => plans.find((p) => p.type === 'one-time') || null,
//     [plans]
//   );
//   const emergencyPlan = useMemo(
//     () => plans.find((p) => p.type === 'emergency') || null,
//     [plans]
//   );

//   const selectedPlan = useMemo(() => {
//     if (type === 'subscription') {
//       return plans.find((p) => p._id === selectedPlanId) || null;
//     }
//     if (type === 'one-time') return oneTimePlan;
//     if (type === 'emergency') return emergencyPlan;
//     return null;
//   }, [type, plans, selectedPlanId, oneTimePlan, emergencyPlan]);

//   /* -------- Available cylinder sizes for chosen plan -------- */
//   const availableSizes = useMemo(() => {
//     if (!selectedPlan) return [5, 6, 12.5, 25, 50];

//     if (Array.isArray(selectedPlan.cylinderSizes) && selectedPlan.cylinderSizes.length > 0) {
//       return selectedPlan.cylinderSizes
//         .map((s) => parseFloat(String(s).replace(/kg/i, '')))
//         .filter((n) => Number.isFinite(n));
//     }

//     if (selectedPlan.baseSize) {
//       const base = parseFloat(String(selectedPlan.baseSize).replace(/kg/i, ''));
//       if (Number.isFinite(base)) {
//         return Array.from(new Set([5, 6, 12.5, 25, 50, base])).sort((a, b) => a - b);
//       }
//     }

//     if (selectedPlan.type === 'custom' && selectedPlan.cylinderSizeRange) {
//       const { min, max } = selectedPlan.cylinderSizeRange;
//       return [5, 6, 12.5, 25, 50].filter((n) => n >= min && n <= max);
//     }

//     return [5, 6, 12.5, 25, 50];
//   }, [selectedPlan]);

//   // Reset size if it's not available for the newly selected plan
//   useEffect(() => {
//     if (!availableSizes.includes(sizeKg)) {
//       setSizeKg(availableSizes[0] ?? null);
//     }
//     /* eslint-disable-next-line */
//   }, [selectedPlan?._id]);

//   /* -------- Frequency/period reset for non-subscription -------- */
//   const effectiveFrequency =
//     type === 'one-time' ? 'One-Time'
//     : type === 'emergency' ? 'Emergency'
//     : frequency;

//   const effectivePeriod = type === 'subscription' ? period : 1;

//   /* -------- Live totals -------- */
//   const totals = useMemo(() => {
//     if (!selectedPlan || !sizeKg) return null;
//     return calculateTotals({
//       plan: selectedPlan,
//       sizeKg,
//       frequency: effectiveFrequency,
//       period: effectivePeriod,
//     });
//   }, [selectedPlan, sizeKg, effectiveFrequency, effectivePeriod]);

//   /* -------- Submit -------- */
//   const submit = async () => {
//     setSubmitState({ status: 'submitting', error: '', order: null, subscription: null });

//     if (!selectedPlan) {
//       setSubmitState({ status: 'idle', error: 'Please complete your selection.', order: null, subscription: null });
//       return;
//     }
//     if (!sizeKg) {
//       setSubmitState({ status: 'idle', error: 'Please choose a cylinder size.', order: null, subscription: null });
//       return;
//     }
    
//     // Check for address from the registered user profile
//     if (!user?.address || !user?.city) {
//       setSubmitState({ status: 'idle', error: 'Please complete your delivery address in your profile before ordering.', order: null, subscription: null });
//       return;
//     }

//     try {
//       if (type === 'subscription') {
//         const payload = {
//           plan: selectedPlan._id,
//           size: `${sizeKg}kg`,
//           frequency,
//           subscriptionPeriod: period,
//           paymentMethod,
//         };
//         const res = await ApiService.subscriptions.create(payload);
//         const body = res?.data ?? {};
//         const url = body.authorization_url || unwrap(res)?.authorization_url;
//         if (paymentMethod === 'paystack' && url) {
//           window.location.assign(url);
//           return;
//         }
//         setSubmitState({ status: 'success', error: '', subscription: body.data ?? unwrap(res), order: null });
//         return;
//       }

//       // One-time / emergency → order
//       const payload = {
//         products: [{ product: selectedPlan._id, quantity: 1 }],
//         deliveryOption: 'standard',
//         address: user.address,
//         city: user.city,
//         paymentMethod,
//       };
//       const res = await ApiService.subscriptions.create(payload);
//       const body = res?.data ?? {};
//       const url = body.authorization_url || unwrap(res)?.authorization_url;
//       if (paymentMethod === 'paystack' && url) {
//         window.location.assign(url);
//         return;
//       }
//       setSubmitState({ status: 'success', error: '', order: body.data ?? unwrap(res), subscription: null });
//     } catch (err) {
//       setSubmitState({
//         status: 'idle',
//         error:
//           err?.response?.data?.error ||
//           err?.response?.data?.message ||
//           err?.message ||
//           'We could not start this order. Please try again.',
//         order: null,
//         subscription: null,
//       });
//     }
//   };

//   /* ============================================================
//      SUCCESS VIEW
//      ============================================================ */
//   if (submitState.status === 'success') {
//     const isSub = !!submitState.subscription;
//     return (
//       <>
//         <PageHeader title="Order started" subtitle="We're preparing everything now." />
//         <div className="egas-og-success">
//           <div className="egas-og-success__icon"><Check size={32} /></div>
//           <h2>{isSub ? 'Subscription active' : 'Order placed'}</h2>
//           <p>
//             {isSub
//               ? 'Your subscription is active. Manage deliveries any time from your dashboard.'
//               : 'Your order is confirmed. Track it from your orders page.'}
//           </p>
//           <div className="egas-og-success__actions">
//             <Button href="/dashboard/overview" variant="primary">Back to dashboard</Button>
//             <Button
//               href={isSub ? '/dashboard/subscriptions' : '/dashboard/orders'}
//               variant="secondary"
//             >
//               {isSub ? 'Manage subscription' : 'View orders'}
//             </Button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ============================================================
//      LANDING — no type selected
//      ============================================================ */
//   if (!type) {
//     return (
//       <>
//         <PageHeader
//           title="Order Gas"
//           subtitle="Choose how you want your LPG delivered."
//         />

//         {plansStatus === 'loading' && (
//           <div className="egas-og-landing">
//             <SkeletonCard /><SkeletonCard /><SkeletonCard />
//           </div>
//         )}

//         {plansStatus === 'error' && (
//           <ErrorState
//             title="We couldn't load the available plans"
//             description="Please refresh the page in a moment."
//             onRetry={() => window.location.reload()}
//           />
//         )}

//         {plansStatus === 'success' && (
//           <div className="egas-og-landing">
//             {Object.values(ORDER_TYPES).map((t) => {
//               const Icon = t.icon;
//               const startingPrice = t.key === 'subscription'
//                 ? lowestSubscriptionRate(subscriptionPlans)
//                 : t.key === 'one-time'
//                   ? oneTimePlan?.pricePerKg
//                   : emergencyPlan?.pricePerKg;

//               return (
//                 <button
//                   key={t.key}
//                   type="button"
//                   className="egas-og-tile"
//                   onClick={() => setType(t.key)}
//                 >
//                   <span className={`egas-og-tile__badge egas-og-tile__badge--${t.badge}`}>
//                     {t.label}
//                   </span>
//                   <span className="egas-og-tile__icon"><Icon size={20} /></span>
//                   <h2 className="egas-og-tile__title">{t.label}</h2>
//                   <p className="egas-og-tile__desc">{t.desc}</p>
//                   <ul className="egas-og-tile__bullets">
//                     {t.bullets.map((b) => (
//                       <li key={b}><Check size={12} /> {b}</li>
//                     ))}
//                   </ul>
//                   <div className="egas-og-tile__cta">
//                     <span>
//                       {startingPrice
//                         ? `From ${naira(startingPrice)} / kg`
//                         : 'Choose options'}
//                     </span>
//                     <span>→</span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         <p className="egas-text--sm" style={{ textAlign: 'center', marginTop: 'var(--sp-6)', color: 'var(--egas-text-secondary)' }}>
//           All prices are calculated and validated by e-GAS on the server.
//         </p>
//       </>
//     );
//   }

//   /* ============================================================
//      CONFIGURATOR — type selected
//      ============================================================ */
//   const t = ORDER_TYPES[type];
//   const isSub = type === 'subscription';

//   const formattedAddress = user?.address 
//     ? `${user.address}, ${user.city || ''} ${user.state || ''}`.trim() 
//     : 'No address saved';
    
//   const gpsString = user?.gpsCoordinates?.coordinates 
//     ? `${user.gpsCoordinates.coordinates[1].toFixed(4)}°N, ${user.gpsCoordinates.coordinates[0].toFixed(4)}°E`
//     : null;

//   return (
//     <>
//       <PageHeader
//         title={t.label}
//         subtitle={t.desc}
//         actions={
//           <Button
//             variant="ghost"
//             size="sm"
//             leftIcon={<ChevronLeft size={14} />}
//             onClick={() => {
//               setType(null);
//               setSelectedPlanId('');
//               setSizeKg(null);
//             }}
//           >
//             Change order type
//           </Button>
//         }
//       />

//       <div className="egas-og-config">
//         {/* ---------------- MAIN ---------------- */}
//         <div className="egas-og-config__main">

//           {/* Plan selector (subscription only) */}
//           {isSub && (
//             <section className="egas-og-section">
//               <div className="egas-og-section__head">
//                 <h2 className="egas-og-section__title">Choose your plan</h2>
//                 <p className="egas-og-section__hint">Basic, Family or Business</p>
//               </div>

//               {subscriptionPlans.length === 0 ? (
//                 <p className="egas-text--sm">No subscription plans are available right now.</p>
//               ) : (
//                 <div className="egas-og-plans">
//                   {subscriptionPlans.map((p) => {
//                     const selected = selectedPlanId === p._id;
//                     return (
//                       <button
//                         key={p._id}
//                         type="button"
//                         className={`egas-og-plan ${selected ? 'is-selected' : ''}`}
//                         onClick={() => setSelectedPlanId(p._id)}
//                       >
//                         {p.isPopular && <span className="egas-og-plan__badge">Most popular</span>}
//                         <h3 className="egas-og-plan__name">{p.name}</h3>
//                         {p.pricePerKg != null && (
//                           <p className="egas-og-plan__rate">{naira(p.pricePerKg)} / kg</p>
//                         )}
//                         {p.shortDescription && (
//                           <p className="egas-og-plan__desc">{p.shortDescription}</p>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* Cylinder size — all order types */}
//           <section className="egas-og-section">
//             <div className="egas-og-section__head">
//               <h2 className="egas-og-section__title">Cylinder size</h2>
//               <p className="egas-og-section__hint">
//                 {isSub
//                   ? 'Pick the cylinder you want refilled on each delivery'
//                   : 'Pick the cylinder size you need'}
//               </p>
//             </div>
//             <div className="egas-og-sizes">
//               {availableSizes.map((kg) => {
//                 const selected = sizeKg === kg;
//                 const unitPrice = selectedPlan?.pricePerKg
//                   ? Number(selectedPlan.pricePerKg) * kg
//                   : null;
//                 return (
//                   <button
//                     key={kg}
//                     type="button"
//                     className={`egas-og-size ${selected ? 'is-selected' : ''}`}
//                     onClick={() => setSizeKg(kg)}
//                     disabled={!selectedPlan}
//                   >
//                     {selected && (
//                       <span className="egas-og-size__check" aria-hidden="true">
//                         <Check size={12} />
//                       </span>
//                     )}
//                     <span className="egas-og-size__kg">
//                       {kg}<small>kg</small>
//                     </span>
//                     {unitPrice != null && (
//                       <span className="egas-og-size__price">{naira(unitPrice)}</span>
//                     )}
//                     <span className="egas-og-size__hint">
//                       {sizeHint(kg)}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Subscription schedule */}
//           {isSub && (
//             <section className="egas-og-section">
//               <div className="egas-og-section__head">
//                 <h2 className="egas-og-section__title">Delivery frequency</h2>
//                 <p className="egas-og-section__hint">How often we deliver</p>
//               </div>
//               <div className="egas-og-chips">
//                 {FREQUENCIES.map((f) => (
//                   <button
//                     key={f.value}
//                     type="button"
//                     className={`egas-og-chip ${frequency === f.value ? 'is-selected' : ''}`}
//                     onClick={() => setFrequency(f.value)}
//                   >
//                     <Calendar size={12} /> {f.label}
//                     <span style={{ opacity: 0.6 }}>· {f.short}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="egas-og-section__head" style={{ marginTop: 'var(--sp-5)' }}>
//                 <h2 className="egas-og-section__title">Subscription period</h2>
//                 <p className="egas-og-section__hint">How long</p>
//               </div>
//               <div className="egas-og-chips">
//                 {PERIODS.map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     className={`egas-og-chip ${period === p ? 'is-selected' : ''}`}
//                     onClick={() => setPeriod(p)}
//                   >
//                     {p} month{p > 1 ? 's' : ''}
//                   </button>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Delivery Address (Read-only from Profile) */}
//           <section className="egas-og-section">
//             <div className="egas-og-section__head">
//               <h2 className="egas-og-section__title">Delivery location</h2>
//             </div>
            
//             <div className="egas-og-address-card">
//               <div className="egas-og-address-card__icon">
//                 <MapPin size={18} />
//               </div>
//               <div className="egas-og-address-card__content">
//                 <p className="egas-og-address-card__title">Registered Address</p>
//                 <p className="egas-og-address-card__text">
//                   {formattedAddress}
//                 </p>
//                 {gpsString && (
//                   <span className="egas-og-address-card__gps">
//                     {gpsString}
//                   </span>
//                 )}
//               </div>
//               <Link to="/dashboard/profile" className="egas-og-address-card__change">
//                 Change address
//               </Link>
//             </div>
            
//             <div className="egas-og-address-card__note">
//               <Info size={14} />
//               Your gas will be delivered to this location.
//             </div>
//           </section>

//           {/* Payment method */}
//           <section className="egas-og-section">
//             <div className="egas-og-section__head">
//               <h2 className="egas-og-section__title">Payment method</h2>
//             </div>
//             <div className="egas-og-pay">
//               <button
//                 type="button"
//                 className={`egas-og-pay-option ${paymentMethod === 'paystack' ? 'is-selected' : ''}`}
//                 onClick={() => setPaymentMethod('paystack')}
//               >
//                 <span className="egas-og-pay-option__radio" aria-hidden="true" />
//                 <div style={{ flex: 1 }}>
//                   <p className="egas-og-pay-option__title">
//                     <CreditCard size={14} /> Card via Paystack
//                   </p>
//                   <p className="egas-og-pay-option__desc">
//                     You&apos;ll be redirected to a secure Paystack page.
//                   </p>
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 className={`egas-og-pay-option ${paymentMethod === 'wallet' ? 'is-selected' : ''} ${
//                   walletBalance != null && walletBalance <= 0 ? 'is-disabled' : ''
//                 }`}
//                 onClick={() => walletBalance > 0 && setPaymentMethod('wallet')}
//                 disabled={walletBalance != null && walletBalance <= 0}
//               >
//                 <span className="egas-og-pay-option__radio" aria-hidden="true" />
//                 <div style={{ flex: 1 }}>
//                   <p className="egas-og-pay-option__title">
//                     <Wallet size={14} /> e-GAS Wallet
//                   </p>
//                   <p className="egas-og-pay-option__desc">
//                     Instantly deduct from your wallet balance.
//                   </p>
//                   {walletBalance != null && (
//                     <span className="egas-og-pay-option__balance">
//                       Balance: {naira(walletBalance)}
//                       {walletBalance <= 0 && ' — top up to use this method.'}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             </div>

//             {submitState.error && (
//               <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
//                 <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//                 <span>{submitState.error}</span>
//               </div>
//             )}
//           </section>
//         </div>

//         {/* ---------------- ASIDE: LIVE PRICING ---------------- */}
//         <aside className="egas-og-config__aside">
//           <div className="egas-og-pricecard">
//             <div className="egas-og-pricecard__head">
//               <h3 className="egas-og-pricecard__title">Your price</h3>
//               <span className="egas-og-pricecard__live">Live</span>
//             </div>

//             {!selectedPlan || !sizeKg || !totals ? (
//               <p className="egas-text--sm" style={{ margin: 0 }}>
//                 Choose your options to see the price.
//               </p>
//             ) : (
//               <>
//                 <ul className="egas-og-summary">
//                   <li>
//                     <span>Type</span>
//                     <span>{t.label}</span>
//                   </li>
//                   {isSub && (
//                     <li>
//                       <span>Plan</span>
//                       <span>{selectedPlan.name}</span>
//                     </li>
//                   )}
//                   <li>
//                     <span>Cylinder</span>
//                     <span>{sizeKg} kg</span>
//                   </li>
//                   <li>
//                     <span>Rate</span>
//                     <span>{naira(totals.pricePerKg)} / kg</span>
//                   </li>

//                   {isSub && (
//                     <>
//                       <li>
//                         <span>Frequency</span>
//                         <span>{frequency}</span>
//                       </li>
//                       <li>
//                         <span>Period</span>
//                         <span>{period} month{period > 1 ? 's' : ''}</span>
//                       </li>
//                       <li>
//                         <span>Deliveries</span>
//                         <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
//                           {totals.totalDeliveries}
//                           {totals.initialDelivery && (
//                             <span className="egas-og-tag">
//                               <PackageCheck size={10} /> incl. initial
//                             </span>
//                           )}
//                         </span>
//                       </li>
//                     </>
//                   )}

//                   <li>
//                     <span>Subtotal</span>
//                     <span>{naira(totals.baseAmount)}</span>
//                   </li>

//                   <li className="egas-og-summary__total">
//                     <span>Total</span>
//                     <span>{naira(totals.totalAmount)}</span>
//                   </li>
//                 </ul>

//                 {isSub && totals.initialDelivery && (
//                   <p className="egas-og-note" style={{ marginTop: 'var(--sp-3)' }}>
//                     <Info size={12} />
//                     Your first month includes an initial delivery in addition to
//                     your regular schedule.
//                   </p>
//                 )}

//                 <p className="egas-og-note" style={{ marginTop: 'var(--sp-2)' }}>
//                   <Sparkles size={12} />
//                   Final total is calculated and validated by e-GAS at checkout.
//                 </p>
//               </>
//             )}
//           </div>

//           <Button
//             variant="primary"
//             size="lg"
//             block
//             onClick={submit}
//             loading={submitState.status === 'submitting'}
//             disabled={submitState.status === 'submitting' || !selectedPlan || !sizeKg}
//           >
//             {paymentMethod === 'paystack' ? 'Pay with card' : 'Pay with wallet'}
//           </Button>

//           <Button
//             variant="ghost"
//             block
//             leftIcon={<RefreshCw size={14} />}
//             onClick={() => window.location.reload()}
//             disabled={submitState.status === 'submitting'}
//           >
//             Refresh prices
//           </Button>

//           <p className="egas-og-note">
//             <Truck size={12} />
//             Delivery times depend on the partner plant and your location.
//           </p>
//         </aside>
//       </div>
//     </>
//   );
// }

// /* ============================================================
//    HELPERS
//    ============================================================ */
// function lowestSubscriptionRate(subPlans) {
//   if (!Array.isArray(subPlans) || subPlans.length === 0) return null;
//   const rates = subPlans
//     .map((p) => Number(p.pricePerKg))
//     .filter((n) => Number.isFinite(n) && n > 0);
//   return rates.length ? Math.min(...rates) : null;
// }

// function sizeHint(kg) {
//   if (kg <= 6) return 'Small';
//   if (kg <= 12.5) return 'Medium';
//   if (kg <= 25) return 'Family';
//   return 'Commercial';
// }
























import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Package, Zap, Repeat, Check, ChevronLeft,
  CreditCard, Wallet, AlertCircle, Sparkles, Info,
  Truck, Calendar, PackageCheck, RefreshCw, MapPin,
} from 'lucide-react';
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCard } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { naira, unwrap, unwrapList } from './apiHelpers';
import './order-gas-v2.css';

/* ============================================================
   CONFIG
   ============================================================ */
const ORDER_TYPES = {
  'one-time': {
    key: 'one-time',
    label: 'One-Time Purchase',
    badge: 'primary',
    icon: Package,
    desc: 'Order a cylinder whenever you need a refill.',
    bullets: ['No commitment', 'Pay once', 'Instant scheduling'],
  },
  emergency: {
    key: 'emergency',
    label: 'Emergency Order',
    badge: 'warn',
    icon: Zap,
    desc: 'Ran out right now? We route your request for priority handling.',
    bullets: ['Priority handling', 'Paid once', 'Best-effort dispatch'],
  },
  subscription: {
    key: 'subscription',
    label: 'Subscription',
    badge: 'accent',
    icon: Repeat,
    desc: 'Recurring deliveries on a schedule you pick.',
    bullets: ['Basic, Family or Business plan', 'Pause or cancel', 'First delivery included'],
  },
};

const FREQUENCIES = [
  { value: 'Daily',     label: 'Daily',     short: '1/day' },
  { value: 'Weekly',    label: 'Weekly',    short: '4/month' },
  { value: 'Bi-weekly', label: 'Bi-weekly', short: '2/month' },
  { value: 'Monthly',   label: 'Monthly',   short: '1/month' },
];

const PERIODS = [1, 2, 3, 6, 12];

/* Canonical delivery count — mirrors backend `calculatePrice` */
function deliveriesPerMonth(frequency) {
  switch (frequency) {
    case 'Daily':     return 30;
    case 'Weekly':    return 4;
    case 'Bi-weekly': return 2;
    case 'Monthly':   return 1;
    default:          return 1;
  }
}

/**
 * Compute totals for display. This EXACTLY mirrors
 * subscriptionController.calculatePrice so the preview matches
 * what the backend will return. The backend still re-validates
 * on submit — the frontend never overrides the final amount.
 */
function calculateTotals({ plan, sizeKg, frequency, period }) {
  const pricePerKg = Number(plan?.pricePerKg) || 0;
  const baseAmount = sizeKg * pricePerKg;

  if (frequency === 'One-Time' || frequency === 'Emergency') {
    return {
      pricePerKg,
      baseAmount,
      deliveriesPerMonth: 1,
      initialDelivery: false,
      totalDeliveries: 1,
      totalAmount: Math.round(baseAmount * 1),
    };
  }

  const perMonth = deliveriesPerMonth(frequency);
  const totalDeliveries =
    period === 1
      ? perMonth + 1
      : (perMonth + 1) + perMonth * (period - 1);

  return {
    pricePerKg,
    baseAmount,
    deliveriesPerMonth: perMonth,
    initialDelivery: true,
    totalDeliveries,
    totalAmount: Math.round(baseAmount * totalDeliveries),
  };
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function OrderGasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetPlanId = searchParams.get('plan');

  /* -------- Data -------- */
  const [plans, setPlans] = useState([]);
  const [plansStatus, setPlansStatus] = useState('loading');
  const [walletBalance, setWalletBalance] = useState(null);

  /* -------- Selections -------- */
  const [type, setType] = useState(null);              // null → show landing
  const [sizeKg, setSizeKg] = useState(null);          // number
  const [selectedPlanId, setSelectedPlanId] = useState(presetPlanId || '');
  const [frequency, setFrequency] = useState('Weekly');
  const [period, setPeriod] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('paystack');

  /* -------- Submit -------- */
  const [submitState, setSubmitState] = useState({
    status: 'idle', error: '', order: null, subscription: null,
  });

  /* -------- Load plans + wallet -------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const fn = ApiService.subscriptionPlans?.getAll
                || ApiService.subscriptionPlans?.getActive
                || ApiService.subscriptions?.getPlans;
        if (!fn) throw new Error('Plans API unavailable.');
        const res = await fn();
        const list = unwrapList(res);
        if (!alive) return;
        setPlans(list);
        setPlansStatus('success');

        // Preselect plan if URL param matches
        if (presetPlanId) {
          const match = list.find((p) => p._id === presetPlanId);
          if (match) {
            setSelectedPlanId(match._id);
            const isSub = match.type !== 'one-time' && match.type !== 'emergency';
            setType(isSub ? 'subscription' : match.type);
          }
        }
      } catch {
        if (alive) setPlansStatus('error');
      }
    })();
    return () => { alive = false; };
  }, [presetPlanId]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await ApiService.payments?.getWalletBalance?.();
        if (!alive) return;
        setWalletBalance(res?.data?.balance ?? unwrap(res)?.balance ?? null);
      } catch {
        if (alive) setWalletBalance(null);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* -------- Derived: plans by role -------- */
  const subscriptionPlans = useMemo(
    () => plans.filter((p) => p.type === 'preset' || p.type === 'custom'),
    [plans]
  );

  const oneTimePlan = useMemo(
    () => plans.find((p) => p.type === 'one-time') || null,
    [plans]
  );
  const emergencyPlan = useMemo(
    () => plans.find((p) => p.type === 'emergency') || null,
    [plans]
  );

  const selectedPlan = useMemo(() => {
    if (type === 'subscription') {
      return plans.find((p) => p._id === selectedPlanId) || null;
    }
    if (type === 'one-time') return oneTimePlan;
    if (type === 'emergency') return emergencyPlan;
    return null;
  }, [type, plans, selectedPlanId, oneTimePlan, emergencyPlan]);

  /* -------- Available cylinder sizes for chosen plan -------- */
  const availableSizes = useMemo(() => {
    if (!selectedPlan) return [5, 6, 12.5, 25, 50];

    if (Array.isArray(selectedPlan.cylinderSizes) && selectedPlan.cylinderSizes.length > 0) {
      return selectedPlan.cylinderSizes
        .map((s) => parseFloat(String(s).replace(/kg/i, '')))
        .filter((n) => Number.isFinite(n));
    }

    if (selectedPlan.baseSize) {
      const base = parseFloat(String(selectedPlan.baseSize).replace(/kg/i, ''));
      if (Number.isFinite(base)) {
        return Array.from(new Set([5, 6, 12.5, 25, 50, base])).sort((a, b) => a - b);
      }
    }

    if (selectedPlan.type === 'custom' && selectedPlan.cylinderSizeRange) {
      const { min, max } = selectedPlan.cylinderSizeRange;
      return [5, 6, 12.5, 25, 50].filter((n) => n >= min && n <= max);
    }

    return [5, 6, 12.5, 25, 50];
  }, [selectedPlan]);

  // Reset size if it's not available for the newly selected plan
  useEffect(() => {
    if (!availableSizes.includes(sizeKg)) {
      setSizeKg(availableSizes[0] ?? null);
    }
    /* eslint-disable-next-line */
  }, [selectedPlan?._id]);

  /* -------- Frequency/period reset for non-subscription -------- */
  const effectiveFrequency =
    type === 'one-time' ? 'One-Time'
    : type === 'emergency' ? 'Emergency'
    : frequency;

  const effectivePeriod = type === 'subscription' ? period : 1;

  /* -------- Live totals -------- */
  const totals = useMemo(() => {
    if (!selectedPlan || !sizeKg) return null;
    return calculateTotals({
      plan: selectedPlan,
      sizeKg,
      frequency: effectiveFrequency,
      period: effectivePeriod,
    });
  }, [selectedPlan, sizeKg, effectiveFrequency, effectivePeriod]);

  /* -------- Submit -------- */
  const submit = async () => {
    setSubmitState({ status: 'submitting', error: '', order: null, subscription: null });

    if (!selectedPlan) {
      setSubmitState({ status: 'idle', error: 'Please complete your selection.', order: null, subscription: null });
      return;
    }
    if (!sizeKg) {
      setSubmitState({ status: 'idle', error: 'Please choose a cylinder size.', order: null, subscription: null });
      return;
    }
    
    // Check for address from the registered user profile
    if (!user?.address || !user?.city) {
      setSubmitState({ status: 'idle', error: 'Please complete your delivery address in your profile before ordering.', order: null, subscription: null });
      return;
    }

    try {
      // ---------------------------------------------------------
      // SUBSCRIPTION
      // ---------------------------------------------------------
      if (type === 'subscription') {
        const payload = {
          plan: selectedPlan._id,
          size: `${sizeKg}kg`,
          frequency: frequency,
          subscriptionPeriod: period,
          paymentMethod,
        };
        const res = await ApiService.subscriptions.create(payload);
        const body = res?.data ?? {};
        const url = body.authorization_url || unwrap(res)?.authorization_url;
        if (paymentMethod === 'paystack' && url) {
          window.location.assign(url);
          return;
        }
        setSubmitState({ status: 'success', error: '', subscription: body.data ?? unwrap(res), order: null });
        return;
      }

      // ---------------------------------------------------------
      // ONE-TIME / EMERGENCY
      // ---------------------------------------------------------
      // The backend validation for these types requires:
      // plan (one-time or emergency plan ID), size, frequency ("One-Time" or "Emergency"), 
      // and subscriptionPeriod (1).
      const orderFrequency = type === 'one-time' ? 'One-Time' : 'Emergency';
      
      const payload = {
        plan: selectedPlan._id,
        size: `${sizeKg}kg`,
        frequency: orderFrequency,
        subscriptionPeriod: 1,
        paymentMethod,
      };
      
      const res = await ApiService.subscriptions.create(payload);
      const body = res?.data ?? {};
      const url = body.authorization_url || unwrap(res)?.authorization_url;
      
      if (paymentMethod === 'paystack' && url) {
        window.location.assign(url);
        return;
      }
      
      setSubmitState({ status: 'success', error: '', order: body.data ?? unwrap(res), subscription: null });
      
    } catch (err) {
      setSubmitState({
        status: 'idle',
        error:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'We could not start this order. Please try again.',
        order: null,
        subscription: null,
      });
    }
  };

  /* ============================================================
     SUCCESS VIEW
     ============================================================ */
  if (submitState.status === 'success') {
    const isSub = !!submitState.subscription;
    return (
      <>
        <PageHeader title="Order started" subtitle="We're preparing everything now." />
        <div className="egas-og-success">
          <div className="egas-og-success__icon"><Check size={32} /></div>
          <h2>{isSub ? 'Subscription active' : 'Order placed'}</h2>
          <p>
            {isSub
              ? 'Your subscription is active. Manage deliveries any time from your dashboard.'
              : 'Your order is confirmed. Track it from your orders page.'}
          </p>
          <div className="egas-og-success__actions">
            <Button href="/dashboard/overview" variant="primary">Back to dashboard</Button>
            <Button
              href={isSub ? '/dashboard/subscriptions' : '/dashboard/subscriptions'}
              variant="secondary"
            >
              {isSub ? 'Manage subscription' : 'View orders'}
            </Button>
          </div>
        </div>
      </>
    );
  }

  /* ============================================================
     LANDING — no type selected
     ============================================================ */
  if (!type) {
    return (
      <>
        <PageHeader
          title="Order Gas"
          subtitle="Choose how you want your LPG delivered."
        />

        {plansStatus === 'loading' && (
          <div className="egas-og-landing">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}

        {plansStatus === 'error' && (
          <ErrorState
            title="We couldn't load the available plans"
            description="Please refresh the page in a moment."
            onRetry={() => window.location.reload()}
          />
        )}

        {plansStatus === 'success' && (
          <div className="egas-og-landing">
            {Object.values(ORDER_TYPES).map((t) => {
              const Icon = t.icon;
              const startingPrice = t.key === 'subscription'
                ? lowestSubscriptionRate(subscriptionPlans)
                : t.key === 'one-time'
                  ? oneTimePlan?.pricePerKg
                  : emergencyPlan?.pricePerKg;

              return (
                <button
                  key={t.key}
                  type="button"
                  className="egas-og-tile"
                  onClick={() => setType(t.key)}
                >
                  <span className={`egas-og-tile__badge egas-og-tile__badge--${t.badge}`}>
                    {t.label}
                  </span>
                  <span className="egas-og-tile__icon"><Icon size={20} /></span>
                  <h2 className="egas-og-tile__title">{t.label}</h2>
                  <p className="egas-og-tile__desc">{t.desc}</p>
                  <ul className="egas-og-tile__bullets">
                    {t.bullets.map((b) => (
                      <li key={b}><Check size={12} /> {b}</li>
                    ))}
                  </ul>
                  <div className="egas-og-tile__cta">
                    <span>
                      {startingPrice
                        ? `From ${naira(startingPrice)} / kg`
                        : 'Choose options'}
                    </span>
                    <span>→</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="egas-text--sm" style={{ textAlign: 'center', marginTop: 'var(--sp-6)', color: 'var(--egas-text-secondary)' }}>
          All prices are calculated and validated by e-GAS on the server.
        </p>
      </>
    );
  }

  /* ============================================================
     CONFIGURATOR — type selected
     ============================================================ */
  const t = ORDER_TYPES[type];
  const isSub = type === 'subscription';

  const formattedAddress = user?.address 
    ? `${user.address}, ${user.city || ''} ${user.state || ''}`.trim() 
    : 'No address saved';
    
  const gpsString = user?.gpsCoordinates?.coordinates 
    ? `${user.gpsCoordinates.coordinates[1].toFixed(4)}°N, ${user.gpsCoordinates.coordinates[0].toFixed(4)}°E`
    : null;

  return (
    <>
      <PageHeader
        title={t.label}
        subtitle={t.desc}
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ChevronLeft size={14} />}
            onClick={() => {
              setType(null);
              setSelectedPlanId('');
              setSizeKg(null);
            }}
          >
            Change order type
          </Button>
        }
      />

      <div className="egas-og-config">
        {/* ---------------- MAIN ---------------- */}
        <div className="egas-og-config__main">

          {/* Plan selector (subscription only) */}
          {isSub && (
            <section className="egas-og-section">
              <div className="egas-og-section__head">
                <h2 className="egas-og-section__title">Choose your plan</h2>
                <p className="egas-og-section__hint">Basic, Family or Business</p>
              </div>

              {subscriptionPlans.length === 0 ? (
                <p className="egas-text--sm">No subscription plans are available right now.</p>
              ) : (
                <div className="egas-og-plans">
                  {subscriptionPlans.map((p) => {
                    const selected = selectedPlanId === p._id;
                    return (
                      <button
                        key={p._id}
                        type="button"
                        className={`egas-og-plan ${selected ? 'is-selected' : ''}`}
                        onClick={() => setSelectedPlanId(p._id)}
                      >
                        {p.isPopular && <span className="egas-og-plan__badge">Most popular</span>}
                        <h3 className="egas-og-plan__name">{p.name}</h3>
                        {p.pricePerKg != null && (
                          <p className="egas-og-plan__rate">{naira(p.pricePerKg)} / kg</p>
                        )}
                        {p.shortDescription && (
                          <p className="egas-og-plan__desc">{p.shortDescription}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Cylinder size — all order types */}
          <section className="egas-og-section">
            <div className="egas-og-section__head">
              <h2 className="egas-og-section__title">Cylinder size</h2>
              <p className="egas-og-section__hint">
                {isSub
                  ? 'Pick the cylinder you want refilled on each delivery'
                  : 'Pick the cylinder size you need'}
              </p>
            </div>
            <div className="egas-og-sizes">
              {availableSizes.map((kg) => {
                const selected = sizeKg === kg;
                const unitPrice = selectedPlan?.pricePerKg
                  ? Number(selectedPlan.pricePerKg) * kg
                  : null;
                return (
                  <button
                    key={kg}
                    type="button"
                    className={`egas-og-size ${selected ? 'is-selected' : ''}`}
                    onClick={() => setSizeKg(kg)}
                    disabled={!selectedPlan}
                  >
                    {selected && (
                      <span className="egas-og-size__check" aria-hidden="true">
                        <Check size={12} />
                      </span>
                    )}
                    <span className="egas-og-size__kg">
                      {kg}<small>kg</small>
                    </span>
                    {unitPrice != null && (
                      <span className="egas-og-size__price">{naira(unitPrice)}</span>
                    )}
                    <span className="egas-og-size__hint">
                      {sizeHint(kg)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Subscription schedule */}
          {isSub && (
            <section className="egas-og-section">
              <div className="egas-og-section__head">
                <h2 className="egas-og-section__title">Delivery frequency</h2>
                <p className="egas-og-section__hint">How often we deliver</p>
              </div>
              <div className="egas-og-chips">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`egas-og-chip ${frequency === f.value ? 'is-selected' : ''}`}
                    onClick={() => setFrequency(f.value)}
                  >
                    <Calendar size={12} /> {f.label}
                    <span style={{ opacity: 0.6 }}>· {f.short}</span>
                  </button>
                ))}
              </div>

              <div className="egas-og-section__head" style={{ marginTop: 'var(--sp-5)' }}>
                <h2 className="egas-og-section__title">Subscription period</h2>
                <p className="egas-og-section__hint">How long</p>
              </div>
              <div className="egas-og-chips">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`egas-og-chip ${period === p ? 'is-selected' : ''}`}
                    onClick={() => setPeriod(p)}
                  >
                    {p} month{p > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Delivery Address (Read-only from Profile) */}
          <section className="egas-og-section">
            <div className="egas-og-section__head">
              <h2 className="egas-og-section__title">Delivery location</h2>
            </div>
            
            <div className="egas-og-address-card">
              <div className="egas-og-address-card__icon">
                <MapPin size={18} />
              </div>
              <div className="egas-og-address-card__content">
                <p className="egas-og-address-card__title">Registered Address</p>
                <p className="egas-og-address-card__text">
                  {formattedAddress}
                </p>
                {gpsString && (
                  <span className="egas-og-address-card__gps">
                    {gpsString}
                  </span>
                )}
              </div>
              <Link to="/dashboard/profile" className="egas-og-address-card__change">
                Change address
              </Link>
            </div>
            
            <div className="egas-og-address-card__note">
              <Info size={14} />
              Your gas will be delivered to this location.
            </div>
          </section>

          {/* Payment method */}
          <section className="egas-og-section">
            <div className="egas-og-section__head">
              <h2 className="egas-og-section__title">Payment method</h2>
            </div>
            <div className="egas-og-pay">
              <button
                type="button"
                className={`egas-og-pay-option ${paymentMethod === 'paystack' ? 'is-selected' : ''}`}
                onClick={() => setPaymentMethod('paystack')}
              >
                <span className="egas-og-pay-option__radio" aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <p className="egas-og-pay-option__title">
                    <CreditCard size={14} /> Card via Paystack
                  </p>
                  <p className="egas-og-pay-option__desc">
                    You&apos;ll be redirected to a secure Paystack page.
                  </p>
                </div>
              </button>

              <button
                type="button"
                className={`egas-og-pay-option ${paymentMethod === 'wallet' ? 'is-selected' : ''} ${
                  walletBalance != null && walletBalance <= 0 ? 'is-disabled' : ''
                }`}
                onClick={() => walletBalance > 0 && setPaymentMethod('wallet')}
                disabled={walletBalance != null && walletBalance <= 0}
              >
                <span className="egas-og-pay-option__radio" aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <p className="egas-og-pay-option__title">
                    <Wallet size={14} /> e-GAS Wallet
                  </p>
                  <p className="egas-og-pay-option__desc">
                    Instantly deduct from your wallet balance.
                  </p>
                  {walletBalance != null && (
                    <span className="egas-og-pay-option__balance">
                      Balance: {naira(walletBalance)}
                      {walletBalance <= 0 && ' — top up to use this method.'}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {submitState.error && (
              <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{submitState.error}</span>
              </div>
            )}
          </section>
        </div>

        {/* ---------------- ASIDE: LIVE PRICING ---------------- */}
        <aside className="egas-og-config__aside">
          <div className="egas-og-pricecard">
            <div className="egas-og-pricecard__head">
              <h3 className="egas-og-pricecard__title">Your price</h3>
              <span className="egas-og-pricecard__live">Live</span>
            </div>

            {!selectedPlan || !sizeKg || !totals ? (
              <p className="egas-text--sm" style={{ margin: 0 }}>
                Choose your options to see the price.
              </p>
            ) : (
              <>
                <ul className="egas-og-summary">
                  <li>
                    <span>Type</span>
                    <span>{t.label}</span>
                  </li>
                  {isSub && (
                    <li>
                      <span>Plan</span>
                      <span>{selectedPlan.name}</span>
                    </li>
                  )}
                  <li>
                    <span>Cylinder</span>
                    <span>{sizeKg} kg</span>
                  </li>
                  <li>
                    <span>Rate</span>
                    <span>{naira(totals.pricePerKg)} / kg</span>
                  </li>

                  {isSub && (
                    <>
                      <li>
                        <span>Frequency</span>
                        <span>{frequency}</span>
                      </li>
                      <li>
                        <span>Period</span>
                        <span>{period} month{period > 1 ? 's' : ''}</span>
                      </li>
                      <li>
                        <span>Deliveries</span>
                        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
                          {totals.totalDeliveries}
                          {totals.initialDelivery && (
                            <span className="egas-og-tag">
                              <PackageCheck size={10} /> incl. initial
                            </span>
                          )}
                        </span>
                      </li>
                    </>
                  )}

                  <li>
                    <span>Subtotal</span>
                    <span>{naira(totals.baseAmount)}</span>
                  </li>

                  <li className="egas-og-summary__total">
                    <span>Total</span>
                    <span>{naira(totals.totalAmount)}</span>
                  </li>
                </ul>

                {isSub && totals.initialDelivery && (
                  <p className="egas-og-note" style={{ marginTop: 'var(--sp-3)' }}>
                    <Info size={12} />
                    Your first month includes an initial delivery in addition to
                    your regular schedule.
                  </p>
                )}

                <p className="egas-og-note" style={{ marginTop: 'var(--sp-2)' }}>
                  <Sparkles size={12} />
                  Final total is calculated and validated by e-GAS at checkout.
                </p>
              </>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            block
            onClick={submit}
            loading={submitState.status === 'submitting'}
            disabled={submitState.status === 'submitting' || !selectedPlan || !sizeKg}
          >
            {paymentMethod === 'paystack' ? 'Pay with card' : 'Pay with wallet'}
          </Button>

          <Button
            variant="ghost"
            block
            leftIcon={<RefreshCw size={14} />}
            onClick={() => window.location.reload()}
            disabled={submitState.status === 'submitting'}
          >
            Refresh prices
          </Button>

          <p className="egas-og-note">
            <Truck size={12} />
            Delivery times depend on the partner plant and your location.
          </p>
        </aside>
      </div>
    </>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */
function lowestSubscriptionRate(subPlans) {
  if (!Array.isArray(subPlans) || subPlans.length === 0) return null;
  const rates = subPlans
    .map((p) => Number(p.pricePerKg))
    .filter((n) => Number.isFinite(n) && n > 0);
  return rates.length ? Math.min(...rates) : null;
}

function sizeHint(kg) {
  if (kg <= 6) return 'Small';
  if (kg <= 12.5) return 'Medium';
  if (kg <= 25) return 'Family';
  return 'Commercial';
}