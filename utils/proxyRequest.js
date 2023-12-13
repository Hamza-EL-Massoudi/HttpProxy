// Middleware to proxy the request
const proxyRequest = async (req, res) => {
  try {
    const originalUrl = req.query.originalUrl || '/';
    const response = await axios.get(`${BASE_URL}/${originalUrl}`);

    // Cache the response in Redis for 1 minute (adjust as needed)
    redisClient.setex(
      originalUrl,
      6000,
      JSON.stringify(response.data)
    );

    // Send the response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = proxyRequest;
