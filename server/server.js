require('dotenv').config();


const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRouter');
const authMiddleware = require('./middleware/authMiddleware');
const noteRoutes = require('./routes/noteRouter');

const app = express();

app.use(cors());
app.use(express.json());

// User routes
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Markdown Notes API is running!'
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
    app.get('/api/test-protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully!',
    userId: req.user
  });
});

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
