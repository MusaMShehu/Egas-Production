import React from "react";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <h1 className="page-title">e-GAS Terms of Service</h1>
      <p className="last-updated">Last updated: November 13, 2025</p>

      <section className="terms-section">
        <p>
          Welcome to <strong>e-GAS</strong>. Please read these Terms of Service (“Terms”) carefully before using our
          website, mobile application, or any related services (collectively, the “Services”) operated by
          <strong> e-GAS Company</strong> (“we,” “our,” or “us”).
        </p>
        <p>
          By accessing or using e-GAS, you agree to be bound by these Terms. If you do not agree, please do not use our
          Services.
        </p>

        <h2>1. Use of Our Services</h2>
        <ul>
          <li>You must be at least 18 years old or have parental consent to use e-GAS.</li>
          <li>You agree to use the Services lawfully and ethically.</li>
          <li>You may not engage in fraud, impersonation, or service interference.</li>
        </ul>

        <h2>2. User Accounts</h2>
        <ul>
          <li>Account creation may be required for certain features.</li>
          <li>Keep your login credentials confidential.</li>
          <li>Notify us immediately if you suspect unauthorized use.</li>
        </ul>

        <h2>3. Orders and Deliveries</h2>
        <ul>
          <li>Orders are subject to availability and confirmation.</li>
          <li>Delivery times are estimates and may vary.</li>
          <li>We reserve the right to cancel orders involving fraudulent activity.</li>
        </ul>

        <h2>4. Payments</h2>
        <ul>
          <li>Payments must be made via approved methods such as Paystack or bank transfer.</li>
          <li>All transactions are processed securely.</li>
          <li>We are not responsible for third-party payment errors.</li>
        </ul>

        <h2>5. Subscriptions and Plans</h2>
        <ul>
          <li>Some services may require subscriptions.</li>
          <li>Fees are non-refundable once a plan is activated unless required by law.</li>
          <li>Plans can be modified or canceled from your account settings.</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>
          All content, logos, and materials on e-GAS belong to us or our licensors. You may not copy or distribute our
          content without prior consent.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          e-GAS is not liable for indirect, incidental, or consequential damages resulting from the use of our Services.
        </p>

        <h2>8. Termination</h2>
        <p>
          We may suspend or terminate access if you violate these Terms or engage in unlawful activity.
        </p>

        <h2>9. Changes to the Terms</h2>
        <p>
          e-GAS reserves the right to modify these Terms anytime. Updated versions will be posted on our website.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          📧 <strong>support@egas.com.ng</strong> <br />
          📍 <strong>e-GAS Company HQ, Abuja, Nigeria</strong>
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
