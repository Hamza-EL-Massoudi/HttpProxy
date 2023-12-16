// userController.js
const User = require('../models/userModel');
const BASE_URL = require('../utils/BASE_URL');
const redisClient = require('../utils/redisConnection');

class UserController {
  async getAllUsers(req, res) {
    try {
      let users = await User.find();

      if (users.length < 9) {
        // Fetch users from base_url
        const fetchedUsers = await fetch(`${BASE_URL}/users`);
        let data = await fetchedUsers.json();

        // Save fetched users to the database
        let users = await User.insertMany(data);

        // Update the users array
        users = fetchedUsers;
      }
      redisClient.set(
        req.originalUrl,
        JSON.stringify(users),
        (err, reply) => {
          if (err) {
            console.error('Error setting key in Redis:', err.message);

            return res
              .status(500)
              .json({ error: 'Internal Server Error' });
          }
        }
      );
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
        response = await fetch(`${BASE_URL}/user/${userId}`);
        user = await response.json();
      }

      redisClient.set(
        req.originalUrl,
        JSON.stringify(user),
        (err, reply) => {
          if (err) {
            console.error('Error setting key in Redis:', err.message);

            return res
              .status(500)
              .json({ error: 'Internal Server Error' });
          }
        }
      );

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
