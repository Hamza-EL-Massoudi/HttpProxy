const redisClient = require('./redisConnection');
// Middleware to check the cache first
const checkCache = (req, res, next) => {
  const key = req.originalUrl;

  redisClient.get(key, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      // If cached data exists, send it back
      res.json(JSON.parse(data));
    } else {
      // If no cached data, proceed to the next middleware
      next();
    }
  });
};

module.exports = checkCache;
