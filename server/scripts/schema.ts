import db from '../src/db';

async function createTables() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        bio TEXT,
        status TEXT DEFAULT 'active'
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'user'
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        provider_id INTEGER REFERENCES providers(id),
        time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log(' All tables created successfully.');
  } catch (error) {
    console.error(' Failed to create tables:', error);
  } finally {
    db.end();
  }
}

createTables();
