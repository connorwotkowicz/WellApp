
import dotenv from 'dotenv';
dotenv.config(); 


import db from '../src/db';

console.log('Using DB:', process.env.DATABASE_URL); 

async function seed() {
  try {
    const providers = await db.query(`
      INSERT INTO providers (name, specialty, bio)
      VALUES 
        ('Alice Kim', 'Yoga', 'Certified yoga instructor with 10+ years of experience.'),
        ('Raj Patel', 'Meditation', 'Specializes in mindfulness and stress reduction.'),
        ('Dana Liu', 'Breathwork', 'Holistic coach with focus on breath therapy.')
      RETURNING *;
    `);
    console.log('Seeded providers:', providers.rows);

    const users = await db.query(`
      INSERT INTO users (name, email, role)
      VALUES 
        ('Test User', 'testuser@example.com', 'user'),
        ('Admin User', 'admin@example.com', 'admin')
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `);
    console.log('Seeded users:', users.rows);

    const bookings = await db.query(`
      INSERT INTO bookings (user_id, provider_id, time)
      VALUES 
        (1, 1, NOW() + interval '1 day'),
        (1, 2, NOW() + interval '2 days')
      RETURNING *;
    `);
    console.log('Seeded bookings:', bookings.rows);

    console.log('\n All seed data inserted successfully.');
  } catch (error) {
    console.error(' Seeding failed:', error);
  } finally {
    db.end();
  }
}

seed();
