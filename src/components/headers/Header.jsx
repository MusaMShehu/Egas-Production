import React, { useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import Navbar from "./Navbar";
import AccountSection from "./AccountSection";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";
import logo from "../../images/logos.png";
import { FaBars } from "react-icons/fa6";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginClick = () => {
  navigate("/auth");
};

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
 
  return (
    <header>
      <div className="navbar">
        <div className="hamburger" onClick={toggleMenu}>
          <FaBars className="FaBars" />
        </div>

        <div className="logo">
          <img src={logo} alt="logo" style={{ width: "45px", height: "40px" }} />
        </div>

        <Navbar
          isMenuOpen={isMenuOpen}
          location={location}
          user={user}
          authLoading={loading}
        />

        <AccountSection user={user} onLoginClick={handleLoginClick} />
      </div>
    </header>
  );
};

export default Header;
