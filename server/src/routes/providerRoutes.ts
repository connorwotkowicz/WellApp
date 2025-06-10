import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();


router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Updated SQL query to fetch provider details along with specialty
    const result = await db.query(
      `SELECT providers.id, providers.name, providers.specialty, providers.image_url, providers.bio
       FROM providers
       ORDER BY providers.id`
    );

    res.status(200).json(result.rows); // Include specialty in the response
  } catch (err) {
    console.error('Error fetching providers:', err);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});



router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query('SELECT id, name, service, price, specialty FROM providers WHERE id = $1', [req.params.id]);
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



router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, service, price } = req.body;

  try {
    const result = await db.query(
      'UPDATE providers SET name = $1, service = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, service, price, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Provider not found' });
      return;
    }

    res.status(200).json(result.rows[0]); 
  } catch (err) {
    console.error('Error updating provider:', err);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});


router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM providers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Provider not found' });
      return;
    }

    res.status(200).json({ message: 'Provider deleted successfully', provider: result.rows[0] });
  } catch (err) {
    console.error('Error deleting provider:', err);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});


export default router;
