import { Request, Response } from 'express';
import db from '../db'; 


export const getAllProviders = async (req: Request, res: Response) => {
  try {

    const result = await db.query('SELECT id, name, service, price, specialty FROM providers ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ message: 'Error fetching providers' });
  }
};
