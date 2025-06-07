import express, { Request, Response } from 'express';
import db from '../db';
import { createBooking } from '../controllers/bookingController';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  try {
    const result = userId
      ? await db.query(
          `SELECT b.id, b.time, b.user_id, p.name AS provider_name
           FROM bookings b
           JOIN providers p ON b.provider_id = p.id
           WHERE b.user_id = $1
           ORDER BY b.time DESC`,
          [userId]
        )
      : await db.query(
          `SELECT b.id, b.time, b.user_id, p.name AS provider_name
           FROM bookings b
           JOIN providers p ON b.provider_id = p.id
           ORDER BY b.time DESC`
        );

    const bookings = result.rows.map((row: any) => ({
      id: row.id,
      time: row.time,
      providerName: row.provider_name,
      userId: row.user_id,
    }));

    res.json(bookings);
} catch (err: any) {
  console.error('Error fetching bookings:', err.message, err.stack);
  res.status(500).json({ error: 'Failed to fetch bookings' });
}

});



router.post('/', createBooking);

export default router;
