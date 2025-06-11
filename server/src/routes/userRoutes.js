const express = require('express');
const db = require('../db').default;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (id === 'guest-id') {
    return res.status(200).json({
      id: 'guest-id',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'guest',
    });
  }

  try {
    const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete user with ID: ${id}`);

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log(`No user found with ID: ${id}`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Deleted user:', result.rows[0]);
    res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error deleting user:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const result = await db.query(
      `UPDATE users
       SET name = $1, email = $2, role = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/guest', async (req, res) => {
  const { email, name, address } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO users (email, name, address, role)
       VALUES ($1, $2, $3, 'guest')
       RETURNING id, email, name, address, role`,
      [email || 'guest@example.com', name || 'Guest User', address || 'N/A']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating guest user:', err);
    res.status(500).json({ error: 'Failed to create guest user' });
  }
});

module.exports = router;
