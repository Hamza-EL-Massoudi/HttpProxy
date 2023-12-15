const Post = require('../models/postModel.js');
const fetchAndSavePost = require('../services/fetchAndSavePost.js');
const BASE_URL = require('../utils/BASE_URL.js');

class PostController {
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find();
      if (!posts) {
        const response = await fetch(`${BASE_URL}/posts/${postId}`);
        if (!response.ok) {
          return res.status(404).json({ error: 'Post not found' });
        }

        let data = response.json();
        if (data.length > 0) {
          data.foreach(async (post) => {
            const newPost = new Post({
              id: post.id,
              userId: post.userId,
              title: post.title,
              body: post.body,
            });
            await newPost.save();
            console.log(
              `Post "${newPost.title}" saved to the database.`
            );
          });
        }
      }
      res.json(posts);
    } catch (error) {
      console.error('Error getting posts:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getPostById(req, res) {
    console.log('Getting post by ID');
    const postId = req.params.postId;

    try {
      let post = await Post.findOne({ id: postId });
      console.log(post);
      if (!post) {
        try {
          post = await fetchAndSavePost(postId);
          console.log(post);
          return res.json(post);
        } catch (error) {
          console.error('Error getting post by ID:', error.message);
          return res
            .status(500)
            .json({ error: 'Internal Server Error' });
        }
      } else {
        return res.json(post);
      }
    } catch (error) {
      console.error('Error getting post by ID:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new PostController();
