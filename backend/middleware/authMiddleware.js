import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Guard 1: Are you logged in?
export const protect = async (req, res, next) => {
    let token;
    // Check if the frontend sent a token in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get just the token string
            token = req.headers.authorization.split(' ')[1];
            
            // Verify the token using a secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the user in the database and attach them to the request (minus their password)
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Move on to the next function (the controller)
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Guard 2: Are you an Admin?
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // You are an admin, proceed!
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};