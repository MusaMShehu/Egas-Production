// src/layouts/PublicLayout.js
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "../headers/Header";
import Footer from "../headers/Footer";
import Navbar from "../headers/Navbar";
// import "../styles/PublicLayout.css";

const PublicLayout = () => {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout-container">
      <Header/>

      <main className="main">
        <Outlet />
      </main>

       <Footer/>
       
    </div>
  );
};

export default PublicLayout;
