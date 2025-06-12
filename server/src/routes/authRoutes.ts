import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Register and login routes
router.post('/register', registerUser); // No need for type assertion
router.post('/login', loginUser);       // No need for type assertion

export default router;
