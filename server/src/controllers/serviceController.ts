import { Request, Response } from 'express';
import db from '../db';
// serviceController.ts
export const getAllServices = async (_req: Request, res: Response) => {
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
    `);
    res.status(200).json(result.rows);
  } catch (err: any) {
    console.error('Error fetching services with providers:', err.message);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};
