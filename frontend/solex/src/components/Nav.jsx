import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm py-2">
      <div className="container-fluid">
        
        {/* Brand */}
        <a className="navbar-brand fw-bold fs-4" href="#">Solex</a>
        
        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavDropdown" 
          aria-controls="navbarNavDropdown" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navbar Links and Buttons */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          
          {/* Main Navigation Links (Pushed to the left using me-auto) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shoes">Shoes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>   
            <li className="nav-item">
              <Link className="nav-link" to="/wishlist">Wishlist</Link>
            </li>
          </ul>
          
          {/* Authentication Buttons (Pushed to the right) */}
          <div className="d-flex align-items-center gap-2">
            <Link className="btn btn-outline-dark px-4" to="/login">
              Login
            </Link>
            <Link className="btn btn-dark px-4" to="/signup">
              Sign Up
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}

export default Nav;