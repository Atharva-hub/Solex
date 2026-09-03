import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoeForm from '../components/admin/ShoeForm';
import ShoeManager from '../components/admin/ShoeManager';
import UserAdminManager from '../components/admin/UserAdminManager';

const TABS = {
  CREATE: 'create',
  SHOES: 'shoes',
  ADMINS: 'admins',
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState(TABS.CREATE);
  const [shoeListKey, setShoeListKey] = useState(0); // bump to force ShoeManager to refetch after a create
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Guard: only logged-in admins get past this page.
  if (!userInfo || !userInfo.token) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Admin Access Required</h2>
        <p className="text-muted mb-4">Please log in with an admin account to continue.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (!userInfo.isAdmin) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Not Authorized</h2>
        <p className="text-muted">Your account doesn't have admin access.</p>
      </div>
    );
  }

  const handleShoeCreated = () => {
    setShoeListKey((k) => k + 1);
    setActiveTab(TABS.SHOES);
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Admin Dashboard</h1>

      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === TABS.CREATE ? 'active' : ''}`}
            onClick={() => setActiveTab(TABS.CREATE)}
          >
            Add Shoe
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === TABS.SHOES ? 'active' : ''}`}
            onClick={() => setActiveTab(TABS.SHOES)}
          >
            Manage Shoes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === TABS.ADMINS ? 'active' : ''}`}
            onClick={() => setActiveTab(TABS.ADMINS)}
          >
            Manage Admins
          </button>
        </li>
      </ul>

      {activeTab === TABS.CREATE && <ShoeForm onCreated={handleShoeCreated} />}
      {activeTab === TABS.SHOES && <ShoeManager key={shoeListKey} />}
      {activeTab === TABS.ADMINS && <UserAdminManager />}
    </div>
  );
};

export default Admin;
