import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. Create state for inputs and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // 2. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Send credentials to your Express backend
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the user data and JWT token to the browser
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        // Redirect admins to the dashboard, customers to the home page
        if (data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Display error from the backend (e.g., "Invalid email or password")
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again later.');
    }
  };

  return (
    <>
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row">
            <div className="col-12 ">
                <div className="card shadow border-1">

                    <div className="card-body p-4">
                        <h1 className="card-title text-center fw-bold">Login</h1>
                        
                        {/* 3. Display error message if login fails */}
                        {error && <div className="alert alert-danger mt-3">{error}</div>}

                        {/* 4. Connect the form to the handleSubmit function */}
                        <form onSubmit={handleSubmit}>
                            <div className="row mt-4 g-4">
                                <div className="col-12">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        value={email} // Bind to state
                                        onChange={(e) => setEmail(e.target.value)} // Update state on type
                                        required
                                    />
                                </div>
                                <div className="col-12 mt-4">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                        value={password} // Bind to state
                                        onChange={(e) => setPassword(e.target.value)} // Update state on type
                                        required
                                    />
                                </div>

                                <div className="col-12 mt-4 d-flex justify-content-center">
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                </div>
                                
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login;