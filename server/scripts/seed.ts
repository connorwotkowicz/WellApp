import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import db from '../src/db';

dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

console.log('Using DB:', process.env.DATABASE_URL);
console.log('DB URL before services insert:', process.env.DATABASE_URL);

async function seed() {
  try {

    await db.query(`
      DROP TABLE IF EXISTS provider_availability CASCADE;
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS services CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS providers CASCADE;
    `);

    
    await db.query(`
      CREATE TABLE providers (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        specialty TEXT NOT NULL,
        bio TEXT,
        image_url TEXT,
        service TEXT
      );

      CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER REFERENCES providers(id),
        name TEXT NOT NULL,
        duration_minutes INTEGER,
        price NUMERIC,
        description TEXT,
        specialty TEXT,
        UNIQUE(provider_id, name)
      );

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        billing_address_line1 TEXT,
        billing_address_line2 TEXT,
        billing_city TEXT,
        billing_state TEXT,
        billing_zip TEXT,
        phone TEXT,
        role TEXT DEFAULT 'user'
      );

      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        provider_id INTEGER REFERENCES providers(id),
        service_id INTEGER REFERENCES services(id),
        time TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, provider_id, time)
      );

      CREATE TABLE provider_availability (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        booked BOOLEAN NOT NULL DEFAULT false,
        booked_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Tables created successfully.');
    const providersData = [
      { name: 'Alice Kim', specialty: 'Yoga', bio: 'Certified yoga instructor with 10+ years of experience.', image_url: null, service: 'Yoga' },
      { name: 'Lena Cho', specialty: 'Yoga', bio: 'Yoga and movement specialist with a focus on vinyasa and breath.', image_url: null, service: 'Yoga' },
      { name: 'Jordan Wells', specialty: 'Yoga', bio: 'Blends traditional yoga with functional movement.', image_url: null, service: 'Yoga' },
      { name: 'Raj Patel', specialty: 'Meditation', bio: 'Specializes in mindfulness and stress reduction.', image_url: null, service: 'Meditation' },
      { name: 'Samir Khan', specialty: 'Meditation', bio: 'Former monk turned corporate meditation coach.', image_url: null, service: 'Meditation' },
      { name: 'Maya Singh', specialty: 'Meditation', bio: 'Focuses on emotional clarity and intention-setting.', image_url: null, service: 'Meditation' },
      { name: 'Dana Liu', specialty: 'Therapy', bio: 'Holistic coach with focus on breath therapy.', image_url: null, service: 'Therapy' },
      { name: 'Max Berger', specialty: 'Therapy', bio: 'Certified CBT practitioner and somatic therapist.', image_url: null, service: 'Therapy' },
      { name: 'Dr. Elise Stone', specialty: 'Therapy', bio: 'Licensed psychotherapist integrating somatics and trauma healing.', image_url: null, service: 'Therapy' }
    ];

    for (const provider of providersData) {
      await db.query(
        `INSERT INTO providers (name, specialty, bio, image_url, service)
         VALUES ($1, $2, $3, $4, $5)`,
        [provider.name, provider.specialty, provider.bio, provider.image_url, provider.service]
      );
      console.log(`✔ Inserted provider: ${provider.name}`);
    }

    const providers = await db.query(`SELECT * FROM providers`);
    const providerIdMap = providers.rows.reduce((acc, p) => {
      acc[p.name] = p.id;
      return acc;
    }, {} as Record<string, number>);

  
    const servicesData = [
      {
        providerName: 'Alice Kim',
        name: 'Hatha Yoga Session',
        duration: 60,
        price: 75,
        description: 'A relaxing yoga session focused on mindfulness and breath.',
        specialty: 'Yoga',
      },
      {
        providerName: 'Lena Cho',
        name: 'Vinyasa Flow',
        duration: 60,
        price: 80,
        description: 'Dynamic flow yoga to energize and build strength.',
        specialty: 'Yoga',
      },
      {
        providerName: 'Jordan Wells',
        name: 'Functional Flow Yoga',
        duration: 55,
        price: 78,
        description: 'A hybrid session combining yoga and functional mobility.',
        specialty: 'Yoga',
      },
      {
        providerName: 'Raj Patel',
        name: 'Guided Meditation',
        duration: 45,
        price: 60,
        description: 'A guided practice to help you center your thoughts and reduce stress.',
        specialty: 'Meditation',
      },
      {
        providerName: 'Samir Khan',
        name: 'Deep Awareness Meditation',
        duration: 50,
        price: 70,
        description: 'Explore stillness and presence through deep meditation techniques.',
        specialty: 'Meditation',
      },
      {
        providerName: 'Maya Singh',
        name: 'Intention-Setting Practice',
        duration: 40,
        price: 65,
        description: 'Meditative session focused on goal alignment and clarity.',
        specialty: 'Meditation',
      },
      {
        providerName: 'Dana Liu',
        name: 'Breathwork Therapy',
        duration: 50,
        price: 70,
        description: 'A therapeutic session using conscious breathing techniques to release tension.',
        specialty: 'Therapy',
      },
      {
        providerName: 'Max Berger',
        name: 'Somatic Release Session',
        duration: 55,
        price: 90,
        description: 'Integrative somatic therapy session for emotional and physical release.',
        specialty: 'Therapy',
      },
      {
        providerName: 'Dr. Elise Stone',
        name: 'Trauma-Informed Counseling',
        duration: 60,
        price: 95,
        description: 'Talk therapy incorporating somatic awareness and trauma-informed techniques.',
        specialty: 'Therapy',
      },
    ];

    for (const service of servicesData) {
      const providerId = providerIdMap[service.providerName];
      if (!providerId) continue;

      await db.query(
        `INSERT INTO services (provider_id, name, duration_minutes, price, description, specialty)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [providerId, service.name, service.duration, service.price, service.description, service.specialty]
      );
      console.log(`✔ Inserted service: ${service.name}`);
    }




 const usersData = [
      { 
        name: 'Test User', 
        email: 'testuser@example.com', 
        role: 'user',
        billing_address_line1: '123 Main St',
        billing_address_line2: 'Apt 4B',
        billing_city: 'New York',
        billing_state: 'NY',
        billing_zip: '10001',
        phone: '555-123-4567'
      },
      { 
        name: 'Admin User', 
        email: 'admin@example.com', 
        role: 'admin',
        billing_address_line1: '456 Admin Ave',
        billing_city: 'San Francisco',
        billing_state: 'CA',
        billing_zip: '94105',
        phone: '555-987-6543'
      },
    ];

    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await db.query(
        `INSERT INTO users (name, email, password, role, 
         billing_address_line1, billing_address_line2, billing_city, 
         billing_state, billing_zip, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user.name, user.email, hashedPassword, user.role,
          user.billing_address_line1, user.billing_address_line2 || null,
          user.billing_city, user.billing_state, user.billing_zip, user.phone
        ]
      );
      console.log(`✔ Inserted user: ${user.email}`);
    }



    const userRes = await db.query(`SELECT id, email FROM users`);
    const providerRes = await db.query(`SELECT id, name FROM providers`);
    const serviceRes = await db.query(`SELECT id, name FROM services`);

    const userMap = userRes.rows.reduce((acc, u) => {
      acc[u.email] = u.id;
      return acc;
    }, {} as Record<string, number>);

    const providerMap = providerRes.rows.reduce((acc, p) => {
      acc[p.name] = p.id;
      return acc;
    }, {} as Record<string, number>);

    const serviceMap = serviceRes.rows.reduce((acc, s) => {
      acc[s.name] = s.id;
      return acc;
    }, {} as Record<string, number>);



    const bookingsData = [
      { 
        userEmail: 'testuser@example.com', 
        providerName: 'Alice Kim', 
        serviceName: 'Hatha Yoga Session',
        time: '2025-06-09 09:00:00' 
      },
      { 
        userEmail: 'testuser@example.com', 
        providerName: 'Lena Cho', 
        serviceName: 'Vinyasa Flow',
        time: '2025-06-10 11:00:00' 
      },
    ];

    for (const booking of bookingsData) {
      const userId = userMap[booking.userEmail];
      const providerId = providerMap[booking.providerName];
      const serviceId = serviceMap[booking.serviceName];

      if (!userId || !providerId || !serviceId) {
        console.warn(`Skipped booking: ${booking.userEmail} → ${booking.providerName}`);
        continue;
      }

      await db.query(
        `INSERT INTO bookings (user_id, provider_id, service_id, time)
         VALUES ($1, $2, $3, $4)`,
        [userId, providerId, serviceId, booking.time]
      );
      console.log(`✔ Inserted booking: ${booking.serviceName} at ${booking.time}`);
    }



    const availabilityData = [
      { 
        providerName: 'Alice Kim', 
        start_time: '2025-06-15 09:00:00', 
        booked: false 
      },
      { 
        providerName: 'Alice Kim', 
        start_time: '2025-06-15 10:00:00', 
        booked: true,
        booked_by: 'testuser@example.com'
      },
      { 
        providerName: 'Samir Khan', 
        start_time: '2025-06-16 14:00:00', 
        booked: false 
      },
    ];

    for (const avail of availabilityData) {
      const providerId = providerMap[avail.providerName];
      const bookedById = avail.booked_by ? userMap[avail.booked_by] : null;

      if (!providerId) {
        console.warn(`Skipped availability: provider ${avail.providerName} not found`);
        continue;
      }

      await db.query(
        `INSERT INTO provider_availability 
         (provider_id, start_time, booked, booked_by)
         VALUES ($1, $2, $3, $4)`,
        [providerId, avail.start_time, avail.booked, bookedById]
      );
      console.log(`✔ Inserted availability for ${avail.providerName} at ${avail.start_time}`);
    }





    console.log('\n All seed data inserted successfully.');
  } catch (error) {
    console.error(' Seeding failed:', error);
  } finally {
    db.end();
  }
}

seed();