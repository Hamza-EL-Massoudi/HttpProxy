const redis = require('redis');

const redisClient = redis.createClient();

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
