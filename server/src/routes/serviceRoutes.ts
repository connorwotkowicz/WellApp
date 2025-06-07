import express from 'express';
import { services } from '../data/services';

const router = express.Router();


router.get('/', (req, res) => {
  res.json(services);
});



router.get('/provider/:providerId', (req, res) => {
  const filtered = services.filter(s => s.providerId === req.params.providerId);
  res.json(filtered);
});

export default router;
