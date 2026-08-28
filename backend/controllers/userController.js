import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if we have a user with this email in the database
        const user = await User.findOne({ email });

        // 2. If the user exists, check if the passwords match
        // bcrypt.compare() takes the plain text password and the hashed database password
        if (user && (await bcrypt.compare(password, user.password))) {
            
            // 3. If everything matches, send back the user data AND a new token
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id), // The new VIP wristband!
            });
        } else {
            // 4. If email is wrong OR password is wrong, send a 401 Unauthorized error
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};






export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if a user with this email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Encrypt (Hash) the password
        const salt = await bcrypt.genSalt(10); // Generates random characters to mix in
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // 4. If successful, send the user data AND their new token back to React
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id), // Here is the VIP wristband!
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};