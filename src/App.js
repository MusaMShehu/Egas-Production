import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { useState, useEffect } from "react";
import { isMobile } from 'react-device-detect';


// Notifications
import { SnackbarProvider } from './contexts/SnackbarContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from './contexts/FirebaseNotificationContext';
import NotificationBell from './components/Notifications/FirebaseNotificationBell'
import { useNotificationManager } from './hooks/useFirebaseNotificationManager';


// Public Pages
import PublicLayout from "./components/public/PublicLayout";
import HomeDesktop from "./components/Home/Home";
import HomeMobile from "./components/Home/HomeMobile";
  // Home Nested Routes of public pages
import LearnMore from "./pages/Learn More/learnMore";
import DomesticSolutions from "./pages/Domestic_Solutions/DomesticSolutions";
import RestaurantSolutions from "./pages/Restaurant_Solutions/RestaurantSolutions";
import BusinessSolutions from "./pages/Business_Solutions/BusinessSolutions";
import OpportunitiesLayout from "./components/Layout/opportunitiesLayout";

import DeliveryTeam from './pages/Delivery_Team/delivery-team';
import MaintenanceServices from './pages/Maintenance_Services/MaintenanceServices';
import SafetyGuidelines from './pages/Safety_Guidelines/SafetyGuidelines';
import PricingPlans from './pages/Pricing_Plans/PricingPlans';
import CustomerTestimonials from './pages/Customer_Testimonials/CustomerTestimonials';
import FAQ from './pages/FAQ/FAQ';
import Blog from './pages/blogs/Blog';
import Article from './pages/blogs/Article';
import Careers from './pages/Careers/Careers';

import Products from "./components/Products";
import Services from "./components/Services";
import Contact from "./components/Contact";
import About from "./components/About";
import Business from "./pages/Business_Solutions/BusinessSolutions";
import TermsOfService from "./pages/Others/TermsOfService";
import PrivacyPolicy from "./pages/Others/PrivacyPolicy";

import "./App.css";

// authentication
// import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthPage from "./AuthForm/authPage";
import ForgotPassword from './AuthForm/forgotPassword';


// Order Section
import OrderSummary from "./components/User/UserOrders/OrderSummary";
import ProductCart from "./components/Products/ProductCart";
import VerifyOrder from "./components/Products/verifyOrder";

// Subscription Section
import SubscriptionVerify from './components/Subscription/SubscriptionVerify';
import SubscriptionSuccess from './components/Subscription/SubscriptionSuccess';
import WalletPaymentSuccess from "./components/Subscription/WalletPaymentSuccess";


// Desktop Subscription and Product Selection Pages from Server
import ProductSelection from "./components/Products/ProductSelectionServer";
import DesktopSubscriptionPlans from "./components/Subscription/SubscriptionPlans";

// Mobile Subscription and Product Selection Pages from Server
import MobileSubscriptionPlans from "./components/Subscription/MobileSubscriptionPlans";

// Layouts
import MobileLayout from './components/User/MobileLayout';
import DesktopLayout from "./components/User/DestopLayout";



// USER PANEL DESKTOP

import DesktopDashboardOverview from "./components/User/DashboardOverview";
import DesktopUserOrders from "./components/User/UserOrders/UserOrders";
import DesktopUserSubscriptions from "./components/User/UserSubscriptions/UserSubscriptions";
import DesktopUserHistory from "./components/User/UserHistory/UserHistory";
import DesktopUserPayment from "./components/User/UserPayment/UserPayment";
import DesktopUserProfile from "./components/User/UserProfile/UserProfile";
import DesktopUserSupport from "./components/User/UserSupport/UserSupport";
import DesktopUserSettings from "./components/User/UserSettings/UserSettings";
import DesktopCustomerDeliverySchedule from "./components/User/UserDelivery/CustomerDeliverySchedule";
import DesktopDeliveryRemnant from "./components/User/UserDelivery/DeliveryRemnant";

// USER PANEL MOBILE VIEW
import MobileDashboardOverview from "./components/User/DashboardMobile";
import MobileUserOrders from "./components/User/UserOrders/MobileUserOrders";
import MobileUserSubscriptions from "./components/User/UserSubscriptions/MobileUserSubscriptions";
import MobileUserHistory from "./components/User/UserHistory/MobileUserHistory";
import MobileUserPayment from "./components/User/UserPayment/MobileUserPayment";
import MobileUserProfile from "./components/User/UserProfile/MobileUserProfile";
import MobileUserSupport from "./components/User/UserSupport/MobileUserSupport";
import MobileUserSettings from "./components/User/UserSettings/MobileUserSettings";
import MobileCustomerDeliverySchedule from "./components/User/UserDelivery/MobileCustomerDeliverySchedule";
import MobileDeliveryRemnant from "./components/User/UserDelivery/MobileDeliveryRemnant";



import { PaymentProvider } from './contexts/paymentContext';

// import SubscriptionPayment from './components/payments/subscriptionPayment';
// import WalletTopup from './components/payments/walletTopup';
// import OrderPayment from './components/payments/orderPayment';
// import PaymentCallback from './components/payments/paymentCallback';

// Wallet Topup verify/Callback
import WalletTopupCallback from './components/payments/walletTopupCallback';
// import DeliveryAgentPortal from "./components/Admin/DeliveryManagement/DeliveryAgentPortal";




function App() {

  const userId = "current-user-id";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


// Choose components based on device
  const Home = isMobile ? HomeMobile : HomeDesktop;
  const CustomerDeliverySchedule = isMobile ? MobileCustomerDeliverySchedule : DesktopCustomerDeliverySchedule;
  const UserHistory = isMobile ? MobileUserHistory : DesktopUserHistory;
  const UserPayment = isMobile ? MobileUserPayment : DesktopUserPayment;
  const UserProfile = isMobile ? MobileUserProfile : DesktopUserProfile;
  const UserSubscriptions = isMobile ? MobileUserSubscriptions : DesktopUserSubscriptions;
  const UserOrders = isMobile ? MobileUserOrders : DesktopUserOrders;
  const DashboardOverview = isMobile ? MobileDashboardOverview : DesktopDashboardOverview;
  const UserSupport = isMobile ? MobileUserSupport : DesktopUserSupport;
  const UserSettings = isMobile ? MobileUserSettings : DesktopUserSettings;
  const UserLayout = isMobile ? MobileLayout : DesktopLayout;
  const SubscriptionPlans = isMobile ? MobileSubscriptionPlans : DesktopSubscriptionPlans;
  const DeliveryRemnant = isMobile ? MobileDeliveryRemnant : DesktopDeliveryRemnant;


  return (

    <NotificationProvider userId={userId}>
    <AuthProvider>
      <PaymentProvider>
        <SnackbarProvider>
      <div className="App">
        <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        pauseOnHover
        closeOnClick />
        {/* <NotificationBell /> */}
        <Routes>
        
           
          {/* Public Routes */}

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={ <Home />} />
            <Route path="/opportunities" element={< OpportunitiesLayout/>} >
              <Route index element={<Navigate to="learn-more" replace />} />
              <Route path="learn-more" element={<LearnMore/>} />
              <Route path="domestic-opportunities" element={<DomesticSolutions/>} />
              <Route path="restaurant-opportunities" element={<RestaurantSolutions />} />
              <Route path="business-opportunities" element={<BusinessSolutions />} />
            </Route>
            <Route path="delivery-team" element={<DeliveryTeam />} />
            <Route path="maintenance-services" element={<MaintenanceServices />} />
            <Route path="safety-guidelines" element={<SafetyGuidelines />} />
            <Route path="pricing-plans" element={<PricingPlans />} />
            <Route path="customer-testimonials" element={<CustomerTestimonials />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Article />} />
            <Route path="careers" element={<Careers />} />

            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="business" element={<Business />} />
            <Route path="select_product" element={<ProductSelection />} />
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            <Route path="order_summary" element={<OrderSummary />} />

            <Route path="/terms_of_service" element={<TermsOfService />} />
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          </Route>

          <Route path="/cart" element={<ProductCart />} />
          <Route path="/orders/verify" element={<VerifyOrder />} />

          <Route path="/subscription-Plan" element={<SubscriptionPlans />} />
          <Route path="/subscriptions/verify" element={<SubscriptionVerify />} />
          <Route path="/subscriptions/success" element={<SubscriptionSuccess />} />
          <Route path="/subscriptions/wallet-success" element={<WalletPaymentSuccess />} />


          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

           {/* Wallet Topup callback/verify route */}
            <Route path="/payment/wallet-topup/verify" element={<WalletTopupCallback />} />


          {/* 2nd User Panel */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="subscriptions" element={<UserSubscriptions />} />
            <Route path="history" element={<UserHistory />} />
            <Route path="payments" element={<UserPayment />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="support" element={<UserSupport />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="delivery" element={<CustomerDeliverySchedule />} />
            <Route path="remnant" element={<DeliveryRemnant />} />


              {/* New payment Testing */}
            {/* <Route path="payment/subscribe" element={<SubscriptionPayment />} />
            <Route path="payment/topup" element={<WalletTopup />} />
            <Route path="payment/order" element={<OrderPayment />} />
            <Route path="payment/callback" element={<PaymentCallback />} /> */}

          </Route>      
        </Routes>
      </div>
      </SnackbarProvider>
      </PaymentProvider>
    </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
