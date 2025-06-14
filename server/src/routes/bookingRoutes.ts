import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(`
      SELECT 
        b.id AS booking_id,
        b.user_id,
        b.provider_id,
        b.service_id,
        b.time AS booking_time,
        b.status,
        b.created_at,
        s.name AS service_name,
        p.name AS provider_name,
        u.name AS user_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN providers p ON b.provider_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);
    res.status(200).json(result.rows);  
  } catch (err: unknown) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});



router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { provider_id, service_id, time, status } = req.body;

  try {
    const result = await db.query(
      'UPDATE bookings SET provider_id = $1, service_id = $2, time = $3, status = $4 WHERE id = $5 RETURNING *',
      [provider_id, service_id, time, status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    console.error('Error updating booking details:', err);
    res.status(500).json({ error: 'Failed to update booking details' });
  }
});


router.post('/create-booking', async (req: Request, res: Response): Promise<void> => {
  console.log('Request Body:', req.body);  

  const { providerId, serviceId, time, userId } = req.body;

  if (!providerId || !serviceId || !time || !userId) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = await db.query(
      `INSERT INTO bookings (user_id, provider_id, service_id, time, status)
       VALUES ($1, $2, $3, $4, 'confirmed')
       RETURNING *`,
      [userId, providerId, serviceId, time]
    );

    if (result.rows.length > 0) {
      res.status(201).json({ booking: result.rows[0] });
    } else {
      res.status(409).json({ error: 'Booking already exists for this time' });
    }
  } catch (err: any) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});



router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: result.rows[0] });
  } catch (err: unknown) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});


router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    const result = await db.query(`
      UPDATE bookings 
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `, [status, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;






