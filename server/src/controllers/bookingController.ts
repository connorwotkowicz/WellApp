import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { providerId, serviceId, time } = req.body;

    if (!userId || !providerId || !serviceId || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

 
    await db.query('BEGIN');

  
    const bookingResult = await db.query(
      `INSERT INTO bookings (user_id, provider_id, service_id, time, status)
       VALUES ($1, $2, $3, $4, 'confirmed')
       RETURNING *`,
      [userId, providerId, serviceId, time]
    );

    if (bookingResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(409).json({ error: 'Failed to create booking' });
    }

  
    await db.query(
      `UPDATE availability
       SET is_booked = TRUE
       WHERE provider_id = $1 AND start_time = $2`,
      [providerId, time]
    );

    await db.query('COMMIT');
    return res.status(201).json({ booking: bookingResult.rows[0] });

  } catch (err: any) {
    await db.query('ROLLBACK');
    console.error('Error creating booking:', err.message, err.stack);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
};




export const getUserBookings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId!;

    const result = await db.query(
      `SELECT 
         b.id, b.time, b.status, 
         p.id AS provider_id, p.name AS provider_name, p.specialty, p.image_url AS provider_image,
         s.id AS service_id, s.name AS service_name, s.description AS service_description
       FROM bookings b
       JOIN providers p ON b.provider_id = p.id
       JOIN services s ON b.service_id = s.id
       WHERE b.user_id = $1
       ORDER BY b.time DESC`,
      [userId]
    );

    const bookings = result.rows.map((row: any) => ({
      id: row.id,
      time: row.time,
      status: row.status,
      provider: {
        id: row.provider_id,
        name: row.provider_name,
        specialty: row.specialty,
        image_url: row.provider_image,
      },
      service: {
        id: row.service_id,
        name: row.service_name,
        description: row.service_description,
      },
    }));

    return res.json(bookings);
  } catch (err: any) {
    console.error('Error fetching bookings:', err.message, err.stack);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
