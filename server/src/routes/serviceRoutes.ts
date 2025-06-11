import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();


interface Service {
  service_id: number;
  service_name: string;
  description: string;
  price: number;
  duration: number;
  specialty: string;
  provider_id: number;
  provider_name: string;
  provider_bio: string;
  provider_image: string | null;
}


router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(`
      SELECT 
        s.id AS service_id,
        s.name AS service_name,
        s.description,
        s.duration_minutes AS duration,
        s.price,
        s.specialty, 
        s.provider_id,
        p.name AS provider_name,
        p.bio AS provider_bio,
        p.image_url AS provider_image
      FROM services s
      JOIN providers p ON s.provider_id = p.id
      ORDER BY s.id
    `);
    res.status(200).json(result.rows as Service[]);
  } catch (err) {
    console.error('Error fetching services with providers:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});


router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT 
        s.id AS service_id,
        s.name AS service_name,
        s.description,
        s.duration_minutes AS duration,
        s.price,
        s.specialty, 
        s.provider_id,
        p.name AS provider_name,
        p.bio AS provider_bio,
        p.image_url AS provider_image
      FROM services s
      JOIN providers p ON s.provider_id = p.id
      WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});


router.post('/create-service', async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, duration_minutes, specialty, provider_id } = req.body;

  if (!name || !description || !price || !duration_minutes || !specialty || !provider_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = await db.query(
      `INSERT INTO services (name, description, price, duration_minutes, specialty, provider_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, duration_minutes, specialty, provider_id]
    );

    res.status(201).json({ service: result.rows[0] });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});


router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { service_name, description, price, duration, specialty } = req.body;

  try {
    const result = await db.query(
      `UPDATE services 
       SET name = $1, description = $2, price = $3, duration_minutes = $4, specialty = $5
       WHERE id = $6
       RETURNING *`,
      [service_name, description, price, duration, specialty, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});


router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.status(200).json({ message: 'Service deleted successfully', service: result.rows[0] });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
