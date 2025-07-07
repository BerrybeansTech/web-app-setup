import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
        </div>
    <ul className="sidebar-list">
  <li className="sidebar-item">
    <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <i className="fas fa-tachometer-alt link-icon"></i>
      <span className="link-text">Dashboard</span>
    </NavLink>
  </li>
  <li className="sidebar-item">
    <NavLink to="/reportPage" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <i className="fas fa-chart-line link-icon"></i>
      <span className="link-text">Enquiry</span>
    </NavLink>
  </li>
  <li className="sidebar-item">
    <NavLink to="/view-client/1" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <i className="fas fa-user link-icon"></i>
      <span className="link-text">Client</span>
    </NavLink>
  </li>
  <li className="sidebar-item">
    <NavLink to="/consultation" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <i className="fas fa-file-alt link-icon"></i>
      <span className="link-text">Consultation Form</span>
    </NavLink>
  </li>
</ul>
      </div>

      {/* Mobile Overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
    </>
  );
};

export default Sidebar;
