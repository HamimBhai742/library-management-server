const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add-books', async (req, res) => {
  const { title, author, category, isbn, published_year, total_copies, book_img,publisher } = req.body;
let tp=  parseInt(total_copies);
let py = parseInt(published_year);
console.log(tp,py)
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, category, isbn, published_year, total_copies, available_copies, book_img,publisher) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8) RETURNING *',
      [title, author, category, isbn, py, tp, book_img,publisher]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;