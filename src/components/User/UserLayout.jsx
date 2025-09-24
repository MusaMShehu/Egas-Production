// components/UserLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import "./User.css"

const UserLayout = () => {
  return (
    <div className="user-layout">
      <UserSidebar />
      <div className="user-main">
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
