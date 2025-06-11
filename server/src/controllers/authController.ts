import { Request, Response, NextFunction } from 'express'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import db from '../db'; 

interface User { 
  id: number; 
  name: string; 
  email: string; 
  password: string; 
  role: string; 
}

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
  const { name, email, password, role = 'user' } = req.body;

  try {
    if (!['user', 'admin', 'provider'].includes(role)) {
      res.status(400).json({ error: 'Invalid role. Valid roles are user, admin, and provider.' });
      return;
    }

    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashed, role]
    );
    
    const user = newUser.rows[0];

    if (role === 'provider') {
      const specialty = 'Not Provided';
      const bio = 'No bio available';
      await db.query(
        'INSERT INTO providers (name, id, specialty, bio) VALUES ($1, $2, $3, $4)',
        [name, user.id, specialty, bio]
      );
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    next(error); 
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user: User | undefined = userResult.rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Backend Response:', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_role: user.role
      },
      token,
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
