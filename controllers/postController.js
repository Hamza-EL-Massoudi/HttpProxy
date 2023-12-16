const Post = require('../models/postModel.js');
const fetchAndSavePost = require('../services/fetchAndSavePost.js');
const BASE_URL = require('../utils/BASE_URL.js');
const redisClient = require('../utils/redisConnection.js');

class PostController {
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find();
      if (!posts || posts.length !== 100) {
        const response = await fetch(`${BASE_URL}/posts`);
        if (!response.ok) {
          return res.status(404).json({ error: 'Post not found' });
        }

        let data = await response.json();

        if (data.length > 0) {
          data.forEach(async (post) => {
            const newPost = new Post({
              id: post.id,
              userId: post.userId,
              title: post.title,
              body: post.body,
            });
            await newPost.save();
          });
        }
      }
      redisClient.set(
        req.originalUrl,
        JSON.stringify(posts),
        (err, reply) => {
          if (err) {
            console.error('Error setting key in Redis:', err.message);

            return res
              .status(500)
              .json({ error: 'Internal Server Error' });
          }
        }
      );
      res.json(posts);
    } catch (error) {
      console.error('Error getting posts:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getPostById(req, res) {
    const postId = req.params.postId;

    try {
      let post = await Post.findOne({ id: postId });
      if (!post) {
        try {
          post = await fetchAndSavePost(postId);
        } catch (error) {
          console.error('Error getting post by ID:', error.message);
          return res
            .status(500)
            .json({ error: 'Internal Server Error' });
        }
      }
      redisClient.set(
        req.originalUrl,
        JSON.stringify(post),
        (err, reply) => {
          if (err) {
            console.error('Error setting key in Redis:', err.message);
            return res
              .status(500)
              .json({ error: 'Internal Server Error' });
          }
        }
      );
      return res.json(post);
    } catch (error) {
      console.error('Error getting post by ID:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new PostController();
