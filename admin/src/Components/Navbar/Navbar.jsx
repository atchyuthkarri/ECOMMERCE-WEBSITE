import React from "react";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <img src={navlogo} alt="Logo" className="nav-logo" />
      <p>Storely Admin</p>
      <div className="nav-actions">
        <img src={navProfile} alt="Profile" className="nav-profile" />
        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;