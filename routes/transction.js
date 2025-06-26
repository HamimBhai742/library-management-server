const express = require('express');
const router = express.Router();
const pool = require('../db'); // your PostgreSQL connection

// POST route to create a new transaction
router.post('/transactions', async (req, res) => {
  const { id, book_id, borrow_date, due_date, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO transactions (id, book_id, borrow_date, due_date,  status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, book_id, borrow_date, due_date, status || 'borrowed']
    );
    const re = `UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1 RETURNING *;`;
    const result1 = await pool.query(re, [book_id]);
    res.status(201).json(result.rows[0], result1.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.get('/transactions', async (req, res) => {
  const { book_id, email } = req.query;
  console.log(book_id, email);
  try {
    let query = `SELECT * FROM transactions JOIN users ON transactions.id = users.id`;
    const params = [];

    if (book_id) {
      query += ' WHERE book_id = $1 AND email = $2';
      params.push(book_id, email);
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.put('/return/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE transactions SET return_date = CURRENT_DATE, status = 'returned' WHERE transaction_id = $1`,
      [id]
    );
    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error updating return:', error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

module.exports = router;
