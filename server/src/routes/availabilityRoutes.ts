import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();


router.get('/:providerId', async (req: Request, res: Response): Promise<void> => {
  const { providerId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM availability WHERE provider_id = $1 ORDER BY start_time ASC',
      [providerId]
    );
    res.status(200).json(result.rows);
  } catch (err: unknown) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { providerId, start_time, end_time } = req.body;

  if (!providerId || !start_time || !end_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = await db.query(
      `INSERT INTO availability (provider_id, start_time, end_time, is_booked)
       VALUES ($1, $2, $3, false) RETURNING *`,
      [providerId, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    console.error('Error creating availability:', err);
    res.status(500).json({ error: 'Failed to create availability' });
  }
});


router.patch('/:slotId/book', async (req: Request, res: Response): Promise<void> => {
  const { slotId } = req.params;

  try {
    const result = await db.query(
      'UPDATE availability SET is_booked = true WHERE id = $1 RETURNING *',
      [slotId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Slot not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    console.error('Error booking slot:', err);
    res.status(500).json({ error: 'Failed to book slot' });
  }
});

router.delete('/:slotId', async (req: Request, res: Response): Promise<void> => {
  const { slotId } = req.params;

  try {
    const result = await db.query('DELETE FROM availability WHERE id = $1 RETURNING *', [slotId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Slot not found' });
      return;
    }

    res.status(200).json({ message: 'Slot deleted successfully', slot: result.rows[0] });
  } catch (err: unknown) {
    console.error('Error deleting slot:', err);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

export default router;
