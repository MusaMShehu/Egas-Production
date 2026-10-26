import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Notifications
import { SnackbarProvider } from './contexts/SnackbarContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from './contexts/FirebaseNotificationContext';


// Layouts (Batch 2 + 4)
import PublicLayout from './components/layout/PublicLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// Guards
// import ProtectedRoute from './components/ProtectedRoute';

// Public pages (Batch 2)
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import PricingPage from './pages/public/PricingPage';
import ContactPage from './pages/public/ContactPage';
import FaqPage from './pages/public/FaqPage';

// Auth pages (Batch 3)
import { AuthGateway, ForgotPasswordPage } from './pages/auth';

// Customer pages (Batches 5–8)
import {
  DashboardOverviewPage,
  MyOrdersPage,
  OrderDetailsPage,
  OrderTrackingPage,
  OrderGasPage,
  PlansPage,
  SubscriptionsPage,
  WalletPage,
  HistoryPage,
  DeliverySchedulePage,
  RemnantPage,
  ProfilePage,
  SettingsPage,
  NotificationsPage,
  SupportPage,
} from './pages/customer';

// Payment callbacks (Batch 9)
import {
  PaymentCallbackPage,
  WalletSuccessPage,
  SubscriptionVerifyPage,
  PaymentSuccessPage,
} from './pages/payments';

// Errors (Batch 9)
import { NotFoundPage, UnauthorizedPage, ServerErrorPage } from './pages/errors';



// import TermsOfService from "./pages/Others/TermsOfService";
// import PrivacyPolicy from "./pages/Others/PrivacyPolicy";

import "./App.css";
import './styles/design-system.css';
import './styles/primitives.css';
import './styles/layout.css';
import './pages/public/public-pages.css';
import './pages/auth/auth-pages.css';
import './components/layout/customer-layout.css';
import './pages/customer/customer-pages.css';
import './pages/customer/order-flow.css';
import './pages/customer/batch7.css';
import './pages/customer/batch8.css';
import './pages/errors/errors.css';
import './pages/payments/payments.css';
import './components/orders/orders.css'; 
import './components/subscriptions/subscriptions.css';
import './pages/customer/order-gas-v2.css';





import { PaymentProvider } from './contexts/paymentContext';

// Wallet Topup verify/Callback
// import WalletTopupCallback from './components/payments/walletTopupCallback';

// Create Query Client
const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <PaymentProvider>
            <SnackbarProvider>
              <div className="App">
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  theme="colored"
                  pauseOnHover
                  closeOnClick
                />



                <Routes>
        {/* -------- Public -------- */}
        <Route element={<PublicLayout />}>
          <Route path="/"         element={<HomePage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing"  element={<PricingPage />} />
          <Route path="/contact"  element={<ContactPage />} />
          <Route path="/faq"      element={<FaqPage />} />
        </Route>

        {/* -------- Auth -------- */}
        <Route path="/auth"                  element={<AuthGateway />} />
        <Route path="/forgot-password"       element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ForgotPasswordPage />} />

        {/* -------- Customer dashboard (protected) -------- */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/dashboard" element={<CustomerLayout />}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />

            <Route path="overview"       element={<DashboardOverviewPage />} />
            <Route path="order"          element={<OrderGasPage />} />
            <Route path="plans"          element={<PlansPage />} />
            <Route path="orders"         element={<MyOrdersPage />} />
            <Route path="orders/:id"     element={<OrderDetailsPage />} />
            <Route path="orders/:id/track" element={<OrderTrackingPage />} />

            <Route path="subscriptions"  element={<SubscriptionsPage />} />
            <Route path="delivery"       element={<DeliverySchedulePage />} />
            <Route path="remnant"        element={<RemnantPage />} />
            <Route path="payments"       element={<WalletPage />} />
            <Route path="history"        element={<HistoryPage />} />
            <Route path="profile"        element={<ProfilePage />} />
            <Route path="settings"       element={<SettingsPage />} />
            <Route path="notifications"  element={<NotificationsPage />} />
            <Route path="support"        element={<SupportPage />} />
          </Route>
        {/* </Route> */}

        {/* -------- Payment callbacks (public) -------- */}
        <Route path="/payments/callback"          element={<PaymentCallbackPage />} />
        <Route path="/wallet/callback"            element={<WalletSuccessPage />} />
        <Route path="/payment/wallet-success"     element={<WalletSuccessPage />} />
        <Route path="/subscriptions/verify"       element={<SubscriptionVerifyPage />} />
        <Route path="/subscriptions/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payments/wallet/callback"   element={<PaymentCallbackPage />} />

        {/* -------- Errors -------- */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/server-error" element={<ServerErrorPage />} />
        <Route path="*"             element={<NotFoundPage />} />
    

          

                  {/* <Route path="/cart" element={<ProductCart />} />
                  <Route path="/orders/verify" element={<VerifyOrder />} />

                  <Route path="/subscription-plan" element={<SubscriptionPlans />} />
                  <Route path="/subscriptions/verify" element={<SubscriptionVerify />} />
                  <Route path="/subscriptions/success" element={<SubscriptionSuccess />} />
                  <Route path="/subscriptions/payment-success" element={<WalletPaymentSuccess />} /> */}

                 

                  {/* Wallet Topup callback/verify route */}
                  {/* <Route path="/payment/wallet-topup/verify" element={<WalletTopupCallback />} /> */}

                 
                </Routes>
              </div>
            </SnackbarProvider>
          </PaymentProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;

