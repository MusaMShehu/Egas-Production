import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

// Public Pages
import PublicLayout from "./components/public/PublicLayout";
import Home from "./components/Home/Home";
import Products from "./components/Products";
import Services from "./components/Services";
import Contact from "./components/Contact";
import About from "./components/About";
import Blog from "./pages/blogs/Blog";
import Business from "./pages/business/Business";
// import Header from "./components/headers/Header";
// import Footer from "./components/headers/Footer";
import "./App.css";

import OrderSummary from "./components/User/UserOrders/OrderSummary";
import ProductCartPage from "./components/User/UserOrders/ProductCartPage";
import PaymentGateway from "./components/User/UserOrders/PaymentGateway";

// User Panel
// import OverviewPage from "./components/pages/OverviewPage";
import ProductSelection from "./components/Products/ProductSelectionServer";
import SubscriptionPlans from "./components/pages/SubscriptionPlans";
// import OrderHistoryPage from "./components/pages/OrderHistoryPage";
// import PaymentsPage from "./components/pages/PaymentsPage";
// import ProfilePage from "./components/pages/ProfilePage";
// import SupportPage from "./components/pages/SupportPage";
// import SettingsPage from "./components/pages/SettingsPage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import DashboardLayout from "./DashboardLayout";

// Admin Panel
import AdminLayout from "./components/Admin/AdminLayout";
import AdminOverview from "./components/Admin/AdminOverview";
import UserManagement from "./components/Admin/UserManagement/UserManagement";
import OrderManagement from "./components/Admin/OrderManagement/OrderManagement";
import ProductManagement from "./components/Admin/ProductManagement/AdminProductManagement";
import SubscriptionManagement from "./components/Admin/SubscriptionManagement/SubscriptionManagement";
import SupportManagement from "./components/Admin/SupportManagement/SupportManagement";
import AdminReport from "./components/Admin/Reports/AdminReports";
import AdminPanelSettings from "./components/Admin/Settings/AdminPanelSettings";

// 2nd User Panel
import UserLayout from "./components/User/UserLayout";
import DashboardOverview from "./components/User/DashboardOverview";
import UserOrders from "./components/User/UserOrders/UserOrders";
import UserSubscriptions from "./components/User/UserSubscriptions/UserSubscriptions";
import UserHistory from "./components/User/UserHistory/UserHistory";
import UserPayment from "./components/User/UserPayment/UserPayment";
import UserProfile from "./components/User/UserProfile/UserProfile";
import UserSupport from "./components/User/UserSupport/UserSupport";
import UserSettings from "./components/User/UserSettings/UserSettings";
// import SubscriptionList from "./components/Admin/SubscriptionManagement/SubscriptionList";

// import { useAuth } from "./contexts/AuthContext";

function App() {

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Navigate to="Home" replace />} />
            <Route path="Home" element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="business" element={<Business />} />
            <Route path="select_product" element={<ProductSelection />} />
            <Route path="subscription-list" element={<SubscriptionPlans />} />
            <Route path="order_summary" element={<OrderSummary />} />
          </Route>

          <Route path="/cart" element={<ProductCartPage />} />
          <Route path="/payment" element={<PaymentGateway />} />

          {/* 2nd User Panel */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="subscriptions" element={<UserSubscriptions />} />
            <Route path="history" element={<UserHistory />} />
            <Route path="payment" element={<UserPayment />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="support" element={<UserSupport />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Admin Routes (can also be wrapped with ProtectedRoute if only admins allowed) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="subscriptions" element={<SubscriptionManagement />} />
            <Route path="support" element={<SupportManagement />} />
            <Route path="reports" element={<AdminReport />} />
            <Route path="settings" element={<AdminPanelSettings />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
