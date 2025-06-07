import express from 'express';
import { bookings } from '../data/bookings';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(bookings);
});

export default router;
