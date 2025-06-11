import dotenv from 'dotenv';
import db from './src/db'; 

dotenv.config();

async function testDB() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('DB connected:', res.rows[0]);
  } catch (error) {
    console.error('DB connection error:', error);
  }
}

testDB();
