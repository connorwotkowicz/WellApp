import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';

import providerRoutes from './routes/providerRoutes';
import serviceRoutes from './routes/serviceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import bookingRoutes from './routes/bookingRoutes';
import authRoutes from "./routes/authRoutes";
import helmet from 'helmet';
import availabilityRoutes from './routes/availabilityRoutes';
const checkoutRoutes = require('./routes/checkout');
const userRoutes = require('./routes/userRoutes');


dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);



const allowedOrigins = [
  'http://localhost:3000',          
  'https://welness2k.app.vercel.app', 
  'https://rorodev.ngrok.app'      
];


const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));  
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Wellness API is up!' });
});

app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes); 
app.use('/api/availability', availabilityRoutes);

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend is alive!' });
});

console.log('Using DB URL:', process.env.DATABASE_URL);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export default app;
