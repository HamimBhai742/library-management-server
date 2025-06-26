// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // তোমার frontend URL
  credentials: true
}));
app.use(express.json());


// Routes
const bookRoutes = require('./routes/book');
app.use('/', bookRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/', userRoutes);

const membersRoutes=require('./routes/members')
app.use('/',membersRoutes)

const addBookRoutes = require('./routes/add_books');
app.use('/', addBookRoutes);

const borrowedRoutes = require('./routes/transction');
app.use('/', borrowedRoutes);

const returnRoutes = require('./routes/borrowed');
app.use('/', returnRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Library Management System API');
}
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
