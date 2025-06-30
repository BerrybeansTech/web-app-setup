import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import './navbar.css';
// import Logo from '../assets/images/logo.png'; // Adjust the path as necessary

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <button
            className={`navbar-hamburger ${isSidebarOpen ? 'active' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
      
          <div className="navbar-title-container">
            <h1 className="navbar-title">Eloraa Clinic</h1>

          </div>
        </div>

        <div className="navbar-menu">
          {user && (
            <div className="navbar-user-section">
              <div className="navbar-user-info">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User avatar"
                    className="navbar-user-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircleIcon className="navbar-user-avatar" />
                )}
                <span className="navbar-user-name">{user.displayName || 'Admin'}</span>
              </div>
              <button
                onClick={logout}
                className="navbar-button"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;