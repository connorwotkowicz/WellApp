import { Request, Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/authMiddleware';  

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    
    const isGuest = req.userId === 'guest-id' || req.query.guest === 'true';

    if (isGuest) {
      
      const result = await db.query('SELECT id, name, email, role FROM users WHERE role != $1', ['guest']);
      res.status(200).json(result.rows);
    } else {
      
      const result = await db.query('SELECT id, name, email, role FROM users');
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
