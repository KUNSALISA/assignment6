import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar
import "./Header.css";
import { IoMdLogOut } from "react-icons/io";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user);

  // Extract user data or set default value
  const FirstName = user?.FirstName || "N/A";
  const LastName = user?.LastName || "N/A";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleTitleClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <header className="stddashboard-header">
        <div className="stddashboard-header-left">
          <button className="stddashboard-menu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 onClick={handleTitleClick} style={{ cursor: "pointer" }}>
            ระบบเช็คชื่อออนไลน์
          </h1>
        </div>

        <div className="stddashboard-header-right">
          {/* User Info */}
          <div className="stddashboard-user-info">
            <span className="stddashboard-user-id">
              {FirstName}   {LastName}
            </span>
            <button
              className="logout-button"
              onClick={handleLogout}
              title="ออกจากระบบ"
            >
              <IoMdLogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
};

export default Header;
