import { Request, Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/authMiddleware';  // Import the AuthRequest type

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if the user is a guest (either via JWT or query param)
    const isGuest = req.userId === 'guest-id' || req.query.guest === 'true';

    if (isGuest) {
      // If the request is from a guest, return a restricted set of user data (excluding guests from the list)
      const result = await db.query('SELECT id, name, email, role FROM users WHERE role != $1', ['guest']);
      res.status(200).json(result.rows);
    } else {
      // If the user is not a guest, return the full list of users (admin or authenticated user)
      const result = await db.query('SELECT id, name, email, role FROM users');
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
