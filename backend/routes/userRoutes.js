import express from "express";
import { registerUser, loginUser, getUsers, updateUserRole } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

// Admin-only user management
router.get('/', protect, admin, getUsers);
router.put('/:id/admin', protect, admin, updateUserRole);

export default router;
