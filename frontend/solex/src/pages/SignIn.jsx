import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        adminCode: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to sign up');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to sign up. Please try again.');
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="row">
                <div className="col-12 ">
                    <div className="card shadow border-1">

                        <div className="card-body p-4">
                            <h1 className="card-title text-center fw-bold">Sign In</h1>

                            {error && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row mt-4 g-4">
                                    <div className="col-12">
                                        <label htmlFor="name" className="form-label fw-semibold">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            placeholder="Enter name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={handleChange}
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
                                            name="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mt-4">
                                        <label htmlFor="adminCode" className="form-label fw-semibold">
                                            Admin Code <span className="text-muted fw-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="adminCode"
                                            name="adminCode"
                                            placeholder="Leave blank for a regular account"
                                            value={formData.adminCode}
                                            onChange={handleChange}
                                        />
                                        <div className="form-text">
                                            Only fill this in if you were given an admin signup code.
                                        </div>
                                    </div>

                                    <div className="col-12 mt-4 d-flex justify-content-center">
                                        <button type="submit" className="btn btn-primary">
                                            Sign In
                                        </button>
                                    </div>

                                </div>
                            </form>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default SignIn