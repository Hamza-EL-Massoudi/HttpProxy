const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();

// GET /posts
router.get('/', (req, res) => {
  PostController.getAllPosts(req, res);
});

// GET /posts/:id
router.get('/:id', (req, res) => {
  const postId = req.params.id;
  PostController.getPostById(req, res);
});

// GET /posts/:id/comments
router.get('/ :id/comments', (req, res) => {
  const postId = req.params.id;
  // Logic to get comments for a specific post
});

// POST /posts
router.post('/posts', (req, res) => {
  // Logic to create a new post
});

module.exports = router;
