// routes/user.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/user/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email)
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;