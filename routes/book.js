// routes/books.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/my-book-admin/:id', async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM books WHERE book_id=$1 RETURNING *;`;
  const result = await pool.query(query, [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.json({
    message: 'Book delete successfull',
  });
});

router.put('/my-book/admin/update/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const {
    available_copies,
    category,
    published_year,
    publisher,
    title,
    author,
  } = req.body;
  const av = parseInt(available_copies);
  const pb = parseInt(published_year);
  try {
    const query = `
      UPDATE books
      SET available_copies = $1,
          published_year = $2,
          category= $3,
          publisher= $4,
          title= $5,
          author= $6
      WHERE book_id = $7
      RETURNING *;
    `;
    const result = await pool.query(query, [
      av,
      pb,
      category,
      publisher,
      title,
      author,
      id,
    ]);
    res.json({updateBook:result.rows[0] ,message: "Book Update successfull" });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
