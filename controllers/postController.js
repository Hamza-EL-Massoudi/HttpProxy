const Post = require('../models/postModel.js');

class PostController {
  async savePost(postData) {
    try {
      const newPost = new Post(postData);
      await newPost.save();
      console.log(`Post "${postData.title}" saved to the database.`);
    } catch (error) {
      console.error('Error saving post:', error.message);
      throw new Error('Error saving post');
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      console.error('Error getting posts:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getPostById(req, res) {
    const postId = req.params.id;

    try {
      const post = await Post.findOne({ id: postId });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error getting post by ID:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updatePostById(req, res) {
    const postId = req.params.id;
    const updatedData = req.body;

    try {
      const updatedPost = await Post.findOneAndUpdate(
        { id: postId },
        updatedData,
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      console.log(`Post "${updatedPost.title}" updated.`);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deletePostById(req, res) {
    const postId = req.params.id;

    try {
      const deletedPost = await Post.findOneAndDelete({ id: postId });
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      console.log(`Post "${deletedPost.title}" deleted.`);
      res.json(deletedPost);
    } catch (error) {
      console.error('Error deleting post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new PostController();
