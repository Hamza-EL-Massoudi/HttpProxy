const Post = require('../models/postModel');
const fetchAndSavePost = require('../services/fetchAndSavePost');
const BASE_URL = require('../utils/BASE_URL');
const postController = require('./postController');
// Get one post by ID
const axios = require('axios');

const getCommentById = async (req, res) => {
  let postId = req.params.postId;
  let commentId = req.params.commentId;

  let comment = await Post.findOne(
    {
      id: postId, // Assuming postId is the _id of the post
      'comments.id': commentId,
    },
    {
      'comments.$': 1, // The $ projection operator ensures only the matching comment is returned
    }
  );

  if (comment) {
    return res.status(200).send(comment);
  }

  if (!comment) {
    // Make a request to the baseUrl to get the comments
    try {
      const response = await axios.get(
        `${BASE_URL}/posts/${postId}/comments`
      );
      const comments = response.data;

      // Save the comments to the database
      let post = await Post.findOne({ id: postId });
      if (!post) {
        post = await fetchAndSavePost(postId);
      }
      post.comments.push(...comments);
      await post.save();
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving comments');
    }
  }

  comment = await Post.findOne(
    {
      $and: [
        {
          id: postId,
        },
        {
          comments: {
            $elemMatch: {
              id: commentId,
            },
          },
        },
      ],
    },
    {
      comments: 1,
    }
  );

  res.send(comment);
};

// Get all comments
const getAllComments = async (req, res) => {
  console.log('Getting all comments');
  let postId = req.params.postId;

  let comment = await Post.findOne(
    {
      id: postId,
    },
    {
      comments: 1,
    }
  );

  if (!comment.comments.length > 0) {
    // Make a request to the baseUrl to get the comments
    try {
      const response = await axios.get(
        `${BASE_URL}/posts/${postId}/comments`
      );
      const comments = response.data;
      // Save the comments to the database
      let post = await Post.findOne({ id: postId });
      if (!post) {
        post = await fetchAndSavePost(postId);
      }
      post.comments.push(...comments);
      await post.save();

      res.send(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving comments');
    }
  } else res.send(comment);
};

// Export the controller functions
module.exports = {
  getCommentById,
  getAllComments,
};
