// components/UserLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import LoggedInNavBar from "../headers/LoggedInNavBar";
import "./User.css";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <div>
        <LoggedInNavBar />
      </div>
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
