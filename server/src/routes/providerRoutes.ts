import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();


router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query('SELECT * FROM providers ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching providers:', err);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});


router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query('SELECT * FROM providers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Provider not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching provider:', err);
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
});


router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status || !['active', 'inactive'].includes(status)) {
    res.status(400).json({ error: 'Invalid or missing status value' });
    return;
  }

  try {
    const result = await db.query(
      'UPDATE providers SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Provider not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
