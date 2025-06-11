import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(`
      SELECT 
        p.id AS provider_id,
        p.name AS provider_name,
        p.specialty,
        p.image_url AS provider_image,
        p.bio AS provider_bio
      FROM providers p
      ORDER BY p.id
    `);
    res.status(200).json(result.rows);  // Return the provider data
  } catch (err) {
    console.error('Error fetching providers:', err);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});


router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(
      'SELECT id, name, specialty, image_url, bio, COALESCE(service, \'No Service\') AS service FROM providers WHERE id = $1',
      [req.params.id]
    );
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
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, specialty, bio, image_url } = req.body;

  try {
    const result = await db.query(
      'UPDATE providers SET name = $1, specialty = $2, bio = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [name, specialty, bio, image_url, id]
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
