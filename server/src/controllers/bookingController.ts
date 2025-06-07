import { Request, Response } from 'express';
import db from '../db';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const { userId, providerId, time } = req.body;

  if (!userId || !providerId || !time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = await db.query(
      'INSERT INTO bookings (user_id, provider_id, time) VALUES ($1, $2, $3) RETURNING *',
      [userId, providerId, time]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
