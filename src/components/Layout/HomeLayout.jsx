import { Outlet } from "react-router-dom";
import Blog from "../../pages/blogs/Blog";
import Careers from "../../pages/Careers/Careers";
import DeliveryTeam from "../../pages/Delivery_Team/delivery-team";
import MaintenanceServices from "../../pages/Maintenance_Services/MaintenanceServices";
import SafetyGuidelines from "../../pages/Safety_Guidelines/SafetyGuidelines";
import PricingPlans from "../../pages/Pricing_Plans/PricingPlans";
import CustomerTestimonials from "../../pages/Customer_Testimonials/CustomerTestimonials";
import FAQ from "../../pages/FAQ/FAQ";

const HomeLayout = () => {
  return (
    <div className="user-layout">

      <div className="user-main">
        <main className="user-content">
        <Blog/>
        <Careers/>
        <DeliveryTeam/>
        <MaintenanceServices/>
        <SafetyGuidelines/>
        <PricingPlans/>
        <CustomerTestimonials/>
        <FAQ/>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
