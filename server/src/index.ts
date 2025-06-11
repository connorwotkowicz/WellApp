import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import path from 'path';


import providerRoutes from './routes/providerRoutes';
import serviceRoutes from './routes/serviceRoutes';
import paymentRoutes from './routes/paymentRoutes';

import bookingRoutes from './routes/bookingRoutes';
import authRoutes from "./routes/authRoutes";
const checkoutRoutes = require('./routes/checkout');
const userRoutes = require('./routes/userRoutes')

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);


app.use(cors());
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


app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend is alive!' });
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});


export default app;