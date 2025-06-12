import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  console.log('Authorization header:', authHeader);  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization token missing');
    res.status(401).json({ error: 'Authorization token missing' });
    return; 
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const payload = jwt.verify(token, secret) as { userId: string };
    req.userId = payload.userId;
    console.log('Decoded userId:', req.userId); 
    next();
  } catch (err) {
    console.log('Invalid token error:', err);  
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

