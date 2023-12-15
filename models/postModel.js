const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: Number,
  id: Number,
  name: String,
  email: String,
  body: String,
});

const postSchema = new mongoose.Schema({
  userId: Number,
  id: Number,
  title: String,
  body: String,
  comments: [commentSchema],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
