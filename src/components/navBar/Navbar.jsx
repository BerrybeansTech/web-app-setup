import React, { useState } from 'react';
import './Navbar.css';
import { FaChevronDown, FaSearch, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">Shop</div>
        <div className="navbar-categories">
          <span>Categories</span>
          <FaChevronDown className="dropdown-icon" />
          <div className="dropdown-menu">
            <a href="#art">Art & Collectibles</a>
            <a href="#jewelry">Jewelry & Accessories</a>
            <a href="#clothing">Clothing & Shoes</a>
            <a href="#home">Home & Living</a>
            <a href="#wedding">Weddings</a>
          </div>
        </div>
      </div>

      <div className="navbar-search">
        <input type="text" placeholder="Search for anything..." />
        <button>
          <FaSearch className="search-icon" />
        </button>
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li><a href="#shop">Shop</a></li>
          <li><a href="#favorites">Home Favorites</a></li>
          <li><a href="#fashion">Fashion Finds</a></li>
          <li><a href="#registry">Registry</a></li>
        </ul>
        <div className="navbar-actions">
          <a href="#sign-in" className="sign-in">Sign in</a>
          <a href="#cart" className="cart">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-badge">1</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;