import { Request, Response } from 'express';
import db from '../db';
import { RequestHandler } from 'express';

export const getAllProviders = async (req: Request, res: Response) => {
  try {
    console.log('🔍 Attempting to fetch providers...');
    const result = await db.query(`
      SELECT id, name, service, price, specialty, image_url, bio
      FROM providers
      ORDER BY id
    `);
    console.log('Providers fetched:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('ERROR fetching providers:', error);
    res.status(500).json({ error: error.message || 'Error fetching providers' });
  }
};





export const getProviderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log(' getProviderById hit with id:', id); 

  try {
    const result = await db.query(`
      SELECT p.*, s.id AS service_id
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Provider not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching provider by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};