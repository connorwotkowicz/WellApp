import { Request, Response } from 'express';
import db from '../db';

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
