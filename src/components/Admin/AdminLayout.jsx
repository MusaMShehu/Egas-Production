// components/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./AdminNavbar";
import "./Admin.css"; 

const AdminLayout = () => {
  return (
        
      <div className="admin-main">
        <Navbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
  );
};

export default AdminLayout;
