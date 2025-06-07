import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import providerRoutes from './routes/providerRoutes';
import serviceRoutes from './routes/serviceRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Wellness API is up!' });
});


app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;