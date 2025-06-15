import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

const sslSetting = process.env.NODE_ENV === 'production' ? { 
  rejectUnauthorized: false 
} : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database connection error:', error.message);
    } else {
      console.error('Unexpected error during DB connection:', error);
    }
  }
})();

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  end: () => pool.end(),
};


