const express = require('express');
const PostController = require('../controllers/postController');
const CommentController = require('../controllers/commentController');
const router = express.Router();

// GET /posts
router.get('/', (req, res) => {
  PostController.getAllPosts(req, res);
});

// GET /posts/:id
router.get('/:postId', (req, res) => {
  const postId = req.params.id;
  PostController.getPostById(req, res);
});

// GET /posts/:id/comments
router.get('/:postId/comments', (req, res) => {
  CommentController.getAllComments(req, res);
});

router.get('/:postId/comments/:commentId', (req, res) => {
  // Logic to get the specific comment by its ID
  CommentController.getCommentById(req, res);
});

// POST /posts
router.post('/posts', (req, res) => {
  // Logic to create a new post
});

module.exports = router;
