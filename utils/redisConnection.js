const { createClient } = require('redis');

require('dotenv').config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,

  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.info((err, info) => {
  if (err) {
    console.error('Error connecting to Redis:', err);
  } else {
    console.log('Connected to Redis server');
  }
});
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
