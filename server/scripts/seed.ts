import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import db from '../src/db';

dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

console.log('Using DB:', process.env.DATABASE_URL);
console.log('DB URL before services insert:', process.env.DATABASE_URL);

async function seed() {
  try {
const providersData = [
  { name: 'Alice Kim', specialty: 'Yoga', bio: 'Certified yoga instructor with 10+ years of experience.' },
  { name: 'Lena Cho', specialty: 'Yoga', bio: 'Yoga and movement specialist with a focus on vinyasa and breath.' },
  { name: 'Jordan Wells', specialty: 'Yoga', bio: 'Blends traditional yoga with functional movement.' },

  { name: 'Raj Patel', specialty: 'Meditation', bio: 'Specializes in mindfulness and stress reduction.' },
  { name: 'Samir Khan', specialty: 'Meditation', bio: 'Former monk turned corporate meditation coach.' },
  { name: 'Maya Singh', specialty: 'Meditation', bio: 'Focuses on emotional clarity and intention-setting.' },

  { name: 'Dana Liu', specialty: 'Therapy', bio: 'Holistic coach with focus on breath therapy.' },
  { name: 'Max Berger', specialty: 'Therapy', bio: 'Certified CBT practitioner and somatic therapist.' },
  { name: 'Dr. Elise Stone', specialty: 'Therapy', bio: 'Licensed psychotherapist integrating somatics and trauma healing.' }
];

    for (const provider of providersData) {
      await db.query(
        `INSERT INTO providers (name, specialty, bio)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO NOTHING;`,
        [provider.name, provider.specialty, provider.bio]
      );
      console.log(`Checked and inserted provider: ${provider.name}`);
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

      await db.query(
        `INSERT INTO services (provider_id, name, duration_minutes, price, description, specialty)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (provider_id, name) DO NOTHING;`,
        [providerId, service.name, service.duration, service.price, service.description, service.specialty]
      );

      console.log(`Checked and inserted service: ${service.name}`);
    }

    const usersData = [
      { name: 'Test User', email: 'testuser@example.com', role: 'user' },
      { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    ];

    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await db.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING;`,
        [user.name, user.email, hashedPassword, user.role]
      );

      console.log(`Checked and inserted user: ${user.email}`);
    }

    const bookingsData = [
      { userId: 1, providerId: 1, time: '2025-06-09 00:57:17' },
      { userId: 1, providerId: 2, time: '2025-06-10 00:57:17' },
    ];

    for (const booking of bookingsData) {
      await db.query(
        `INSERT INTO bookings (user_id, provider_id, time)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, provider_id, time) DO NOTHING;`,
        [booking.userId, booking.providerId, booking.time]
      );

      console.log(`Checked and inserted booking for user ${booking.userId} and provider ${booking.providerId}`);
    }

    console.log('\nAll seed data inserted successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    db.end();
  }
}

seed();
