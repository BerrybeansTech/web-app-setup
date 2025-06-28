import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
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
          <NavLink to="/clients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-users link-icon"></i>
            <span className="link-text">Clients</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/add-client" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-user-plus link-icon"></i>
            <span className="link-text">Add Client</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/reportPage" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-chart-line link-icon"></i>
            <span className="link-text">Enquiry</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-file-alt link-icon"></i>
            <span className="link-text">Consultation Form</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
// This component is a sidebar for navigation in a web application.