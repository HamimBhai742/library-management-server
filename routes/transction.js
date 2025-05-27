const express = require('express');
const router = express.Router();
const pool = require('../db'); // your PostgreSQL connection

// POST route to create a new transaction
router.post('/transactions', async (req, res) => {
  const { id, book_id, borrow_date, due_date,  status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO transactions (id, book_id, borrow_date, due_date,  status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, book_id, borrow_date, due_date,  status || 'borrowed']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.get('/transactions', async (req, res) => {
  const { book_id } = req.query;

  try {
    let query = 'SELECT * FROM transactions';
    const params = [];

    if (book_id) {
      query += ' WHERE book_id = $1';
      params.push(book_id);
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
