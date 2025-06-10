import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '/Users/roro/Documents/Projects/wellness/server/.env' });

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    const res = await pool.query('SELECT current_database()');
    console.log('Connected to database:', res.rows[0].current_database);
  } catch (err) {
    console.error('Error connecting:', err);
  } finally {
    await pool.end();
  }
}

test();
