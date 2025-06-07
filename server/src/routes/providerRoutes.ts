import express from 'express';
import { providers } from '../data/providers';

const router = express.Router();


router.get('/', (req, res) => {
  res.json(providers);
});


router.get('/:id', (req, res) => {
  const provider = providers.find(p => p.id === req.params.id);
  if (provider) {
    res.json(provider);
  } else {
    res.status(404).json({ error: 'Provider not found' });
  }
});

export default router;
