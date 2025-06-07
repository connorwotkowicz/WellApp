import express from 'express';
import { users } from '../data/users';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', function (req, res) {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.json(user);
  }
});

export default router;
