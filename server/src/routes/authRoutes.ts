import express, { Request, Response } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Register route
router.post('/register', registerUser as express.RequestHandler);

// Login route
router.post('/login', loginUser as express.RequestHandler);

export default router;
