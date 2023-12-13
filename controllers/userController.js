// userController.js
const User = require('../models/userModel');

class UserController {
  async saveUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      console.log(
        `User "${userData.username}" saved to the database.`
      );
    } catch (error) {
      console.error('Error saving user:', error.message);
      throw new Error('Error saving user');
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getUserById(req, res) {
    const userId = req.params.id;

    try {
      const user = await User.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateUserById(req, res) {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        updatedData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`User "${updatedUser.username}" updated.`);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteUserById(req, res) {
    const userId = req.params.id;

    try {
      const deletedUser = await User.findOneAndDelete({ id: userId });

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`User "${deletedUser.username}" deleted.`);
      res.json(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new UserController();
