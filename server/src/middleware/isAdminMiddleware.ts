import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware'; 
import db from '../db'; 

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.userId) {
    
    db.query('SELECT role FROM users WHERE id = $1', [req.userId])
      .then((result) => {
        if (result.rows.length > 0 && result.rows[0].role === 'admin') {
          return next(); 
        } else {
          res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
      })
      .catch((err) => {
        console.error('Error checking user role:', err);
        res.status(500).json({ error: 'Failed to verify user role' });
      });
  } else {
    res.status(401).json({ error: 'Unauthorized: No user found' });
  }
};
