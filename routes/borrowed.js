const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/borrowed', async (req, res) =>{
try{
  const result = await pool.query(`
  SELECT
    *
  FROM transactions
  JOIN books ON transactions.book_id = books.book_id
  JOIN users ON transactions.id = users.id
`);
res.json(result.rows);
}catch (err){
  console.error(err.message);
  res.status(500).json({ error: 'Database error' });}
})

module.exports = router;