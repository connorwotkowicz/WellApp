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


const getDbInfo = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: url.port,
      database: url.pathname.split('/')[1],
      user: url.username,
      connectionString: `${url.protocol}//${url.hostname}:${url.port}`
    };
  } catch (e) {
    return {
      host: 'unknown',
      port: 'unknown',
      database: 'unknown',
      user: 'unknown',
      connectionString: 'invalid'
    };
  }
};

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password, role = 'user' } = req.body;
  const dbInfo = getDbInfo();

  try {

    console.log('Registration attempt:', {
      email,
      role,
      database: dbInfo.database,
      host: dbInfo.host,
      port: dbInfo.port
    });

    if (!['user', 'admin', 'provider'].includes(role)) {
      console.error(`Invalid role attempt: ${role} in ${dbInfo.database}`);
      res.status(400).json({ error: 'Invalid role. Valid roles are user, admin, and provider.' });
      return;
    }

    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.error(`User already exists in ${dbInfo.database}: ${email}`);
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashed, role]
    );

    const user = newUser.rows[0];
    console.log('User registered successfully:', {
      userId: user.id,
      email: user.email,
      database: dbInfo.database,
      host: dbInfo.host
    });

    if (role === 'provider') {
      const specialty = 'Not Provided';
      const bio = 'No bio available';
      await db.query(
        'INSERT INTO providers (name, id, specialty, bio) VALUES ($1, $2, $3, $4)',
        [name, user.id, specialty, bio]
      );
      console.log(` Provider profile created in ${dbInfo.database} for user: ${user.id}`);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration failed:', {
      error: isError(error) ? error.message : 'Unknown error',
      database: dbInfo.database,
      host: dbInfo.host,
      timestamp: new Date().toISOString()
    });
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const dbInfo = getDbInfo();

  console.log('Login attempt:', { email, database: dbInfo.database });

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      console.error(`Login failed: User not found in ${dbInfo.database} - ${email}`);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error(` Login failed: Password mismatch in ${dbInfo.database} for ${email}`);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Login successful:', {
      userId: user.id,
      email: user.email,
      database: dbInfo.database
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
  } catch (err) {
    console.error('Login error:', {
      error: isError(err) ? err.message : 'Unknown error',
      database: dbInfo.database,
      host: dbInfo.host
    });
    next(err);
  }
};