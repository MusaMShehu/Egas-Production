import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import LoggedInNavBar from "../headers/LoggedInNavBar";
import "./User.css";

const UserLayout = () => {
  const [sidebarState, setSidebarState] = useState({
    hidden: false,
    collapsed: false,
  });

  useEffect(() => {
    const handleSidebarState = (e) => setSidebarState(e.detail);
    window.addEventListener("sidebarStateChange", handleSidebarState);
    return () => window.removeEventListener("sidebarStateChange", handleSidebarState);
  }, []);

  const { hidden, collapsed } = sidebarState;

  return (
    <div
      className={`user-layout ${
        hidden
          ? "sidebar-hidden"
          : collapsed
          ? "sidebar-collapsed"
          : "sidebar-expanded"
      }`}
    >
      <LoggedInNavBar />
      <div className="user-content">
        <div className="content-layout">
          <div className="user-sidebar-layout">
            <UserSidebar />
          </div>
          <div className="user-main">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
