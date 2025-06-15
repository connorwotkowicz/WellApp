import express, { Request, Response } from 'express';
import db from '../db';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

router.get(`/providers/:providerId/availability`, async (req: Request, res: Response) => {
  const { providerId } = req.params;
  
  try {
    const availabilityResult = await db.query(
      `SELECT id, 
              start_time, 
              end_time,
              booked
       FROM provider_availability 
       WHERE provider_id = $1 
         AND start_time > NOW() 
         AND booked = false
       ORDER BY start_time ASC`,
      [providerId]
    );

    const bookingsResult = await db.query(
      `SELECT time FROM bookings 
       WHERE provider_id = $1 AND time > NOW()`,
      [providerId]
    );

    const bookedSlots = bookingsResult.rows.map((b: any) => b.time);
    const availableSlots = availabilityResult.rows.filter((slot: any) => 
      !bookedSlots.some((bookedTime: Date) => 
        bookedTime.getTime() === new Date(slot.start_time).getTime()
      )
    );

    res.status(200).json(availableSlots.map((slot: any) => ({
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time, 
      booked: slot.booked || false
    })));
  } catch (err: unknown) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});


router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { slots } = req.body;
  
  if (!slots || !Array.isArray(slots)) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  try {
    await db.query(
      `DELETE FROM provider_availability 
       WHERE provider_id = $1`,
      [req.userId]
    );

    for (const slot of slots) {
      await db.query(
        `INSERT INTO provider_availability 
         (provider_id, start_time, end_time, booked)
         VALUES ($1, $2::timestamptz, $3::timestamptz, $4)`,
        [req.userId, slot.start_time, slot.end_time, false]
      );
    }
    res.status(201).json({ message: 'Availability saved successfully' });
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({ error: 'Failed to create availability' });
  }
});
router.patch('/:slotId/book', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const slotId = req.params.slotId;
  
  if (!req.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { serviceId } = req.body;
  
  if (!serviceId) {
    res.status(400).json({ error: 'Service ID is required' });
    return;
  }

  try {
 
    await db.query('BEGIN');

  
    const slotResult = await db.query(
      `SELECT * FROM provider_availability 
       WHERE id = $1 
       FOR UPDATE`,
      [slotId]
    );

    if (slotResult.rows.length === 0) {
      await db.query('ROLLBACK');
      res.status(404).json({ error: 'Slot not found' });
      return;
    }

    const slot = slotResult.rows[0];

    if (slot.booked) {
      await db.query('ROLLBACK');
      res.status(409).json({ error: 'Slot already booked' });
      return;
    }

    
    const serviceResult = await db.query(
      `SELECT duration_minutes FROM services WHERE id = $1`,
      [serviceId]
    );
    
    if (serviceResult.rows.length === 0) {
      await db.query('ROLLBACK');
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    
    const duration = serviceResult.rows[0].duration_minutes;
    const startTime = new Date(slot.start_time);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    
    await db.query(
      `INSERT INTO bookings 
       (user_id, provider_id, service_id, time, status)
       VALUES ($1, $2, $3, $4, 'confirmed')`,
      [req.userId, slot.provider_id, serviceId, slot.start_time]
    );

    
    await db.query(
      `UPDATE provider_availability 
       SET booked = true, booked_by = $1
       WHERE id = $2`,
      [req.userId, slotId]
    );

    await db.query('COMMIT');
    res.status(200).json({ message: 'Booking created successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Failed to book slot' });
  }
});


router.delete('/:slotId', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const slotId = req.params.slotId;
  
  if (!req.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {

    const slotResult = await db.query(
      `SELECT * FROM provider_availability 
       WHERE id = $1 AND provider_id = $2`,
      [slotId, req.userId]
    );

    if (slotResult.rows.length === 0) {
      res.status(404).json({ error: 'Slot not found or access denied' });
      return;
    }


    await db.query(
      `DELETE FROM provider_availability 
       WHERE id = $1`,
      [slotId]
    );

    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

export default router;