import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AccountSection from "./AccountSection";
import LoginModal from "./LoginModal";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";
import logo from "../../images/logos.png";
import { FaBars } from "react-icons/fa6";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { user, loading } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen);

  return (
    <header>
      <div className="navbar">
        <div className="hamburger" onClick={toggleMenu}>
          <FaBars className="FaBars" />
        </div>

        <div className="logo">
          <img src={logo} alt="logo" style={{ width: "80px", height: "70px" }} />
        </div>

        <Navbar
          isMenuOpen={isMenuOpen}
          location={location}
          user={user}
          authLoading={loading}
        />

        <AccountSection user={user} onLoginClick={toggleAuthModal} />
      </div>

      {isAuthModalOpen && <LoginModal onClose={toggleAuthModal} />}
    </header>
  );
};

export default Header;
