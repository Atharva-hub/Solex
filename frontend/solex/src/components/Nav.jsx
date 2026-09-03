import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const Nav = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <Link className="nav-link position-relative" to="/cart">
                Cart
                {itemCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-1">{itemCount}</span>
                )}
              </Link>
            </li>   
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/wishlist">
                Wishlist
                {wishlistCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-1">{wishlistCount}</span>
                )}
              </Link>
            </li>
          </ul>
          
          {/* Authentication Buttons (Pushed to the right) */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {user ? (
              <>
                <span className="fw-semibold me-2">Hi, {user.name}</span>
                {user.isAdmin && (
                  <Link className="btn btn-outline-dark px-3" to="/admin">
                    Admin
                  </Link>
                )}
                <button className="btn btn-dark px-4" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-dark px-4" to="/login">
                  Login
                </Link>
                <Link className="btn btn-dark px-4" to="/signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}

export default Nav;