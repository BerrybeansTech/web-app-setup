import React from 'react';
import './navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-container">
      
      {/* Left Side - Logo or Title */}
      <div className="navbar-left">
        <h1 className="navbar-title"></h1>
      </div>

      {/* Right Side - Admin and Logout */}
      <div className="navbar-right">
        <div className="navbar-admin-section">
          <i className="fas fa-user-circle admin-icon"></i>
          <span className="admin-text">Admin</span>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          className="navbar-button"
          aria-label="Logout"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>

    </div>
  </nav>
);

export default Navbar;
