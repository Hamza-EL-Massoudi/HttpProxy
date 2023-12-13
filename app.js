const express = require('express');
const axios = require('axios');
const checkCache = require('./utils/checkCache');
const postRouter = require('./routes/postRoute');
const userRouter = require('./routes/userRoute');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/redisAppDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

app.use(express.json());
app.use(express.static('static'));

app.use('/withcache/posts', checkCache, postRouter);
app.use('/withoutcache/posts', postRouter);
app.use('/withcache/users', checkCache, userRouter);
app.use('/withoutcache/users', userRouter);

app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
