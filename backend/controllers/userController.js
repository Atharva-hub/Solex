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
        const { name, email, password, adminCode } = req.body;

        // 1. Check if a user with this email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Encrypt (Hash) the password
        const salt = await bcrypt.genSalt(10); // Generates random characters to mix in
        const hashedPassword = await bcrypt.hash(password, salt);

        // Optional admin bootstrap: signing up with the secret code from
        // backend/.env (ADMIN_SIGNUP_CODE) creates the account as an admin
        // straight away. This is only how the very first admin gets made -
        // every admin after that should be granted through the "Manage
        // Admins" screen instead of sharing this code around.
        const isAdminSignup = Boolean(
            process.env.ADMIN_SIGNUP_CODE &&
            adminCode &&
            adminCode === process.env.ADMIN_SIGNUP_CODE
        );

        // 3. Create the new user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdminSignup,
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

// @desc    Get all users (admin only)
// @route   GET /api/users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Grant or revoke admin access for a user (admin only)
//          This is the "make someone an admin" button, so nobody has to
//          open the database and flip isAdmin by hand.
// @route   PUT /api/users/:id/admin
export const updateUserRole = async (req, res) => {
    try {
        const { isAdmin } = req.body;

        if (typeof isAdmin !== 'boolean') {
            return res.status(400).json({ message: 'isAdmin must be true or false' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Stop an admin from accidentally locking themselves out
        if (String(user._id) === String(req.user._id) && !isAdmin) {
            return res.status(400).json({ message: 'You cannot remove your own admin access' });
        }

        user.isAdmin = isAdmin;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
