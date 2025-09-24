// components/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import "./Admin.css"; 
import Header from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
