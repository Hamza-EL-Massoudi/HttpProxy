const Post = require('../models/postModel');
const BASE_URL = require('../utils/BASE_URL');
const fetchAndSavePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  if (!response.ok) {
    throw new Error('error fetching post');
  }
  post = await response.json();
  const newPost = new Post({
    id: post.id,
    userId: post.userId,
    title: post.title,
    body: post.body,
  });
  await newPost.save();
  console.log(`Post "${newPost.title}" saved to the database.`);
  return newPost;
};

module.exports = fetchAndSavePost;
