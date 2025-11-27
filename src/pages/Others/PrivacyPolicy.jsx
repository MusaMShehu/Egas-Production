import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="page-title">e-GAS Privacy Policy</h1>
      <p className="last-updated">Last updated: November 13, 2025</p>

      <section className="privacy-section">
        <p>
          At <strong>e-GAS</strong>, your privacy is very important to us. This Privacy Policy explains how we collect,
          use, and protect your personal information when you use our Services.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>Personal Information: Name, phone number, email, and address.</li>
          <li>Account Information: Username, password, and preferences.</li>
          <li>Payment Information: Handled securely via third-party gateways like Paystack.</li>
          <li>Usage Data: IP address, browser type, and app interactions.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process orders and deliveries.</li>
          <li>To improve services and personalize experiences.</li>
          <li>To send order updates and promotional offers.</li>
          <li>To ensure safety and prevent fraud.</li>
        </ul>

        <h2>3. How We Protect Your Information</h2>
        <p>
          We use SSL encryption and secure databases to protect user data. We never sell or rent your personal
          information. Only authorized staff have access to sensitive data.
        </p>

        <h2>4. Cookies and Tracking</h2>
        <p>
          e-GAS uses cookies to enhance performance, remember preferences, and analyze usage. You can disable cookies
          through your browser settings.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We partner with trusted providers for payments, logistics, and analytics. Each third party has its own privacy
          policy and complies with data protection laws.
        </p>

        <h2>6. Your Rights</h2>
        <ul>
          <li>Access and update your data.</li>
          <li>Request deletion of your account.</li>
          <li>Withdraw consent for marketing messages.</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
          We retain data only as long as necessary for service delivery, legal obligations, or dispute resolution.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Updates will be posted on our website with the latest date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          📧 <strong>privacy@egas.com.ng</strong> <br />
          📍 <strong>e-GAS Company HQ, Abuja, Nigeria</strong>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
