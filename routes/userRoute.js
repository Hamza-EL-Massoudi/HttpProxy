const express = require('express');
const UserController = require('../controllers/userController');
const User = require('../models/userModel');

const router = express.Router();

// GET /users
router.get('/', (req, res) => {
  // Handle logic to fetch all users
  UserController.getAllUsers(req, res);
});

// GET /users/:id
router.get('/:id', (req, res) => {
  UserController.getUserById(req, res);
});

// POST /users
router.post('/', (req, res) => {
  UserController.saveUser(req, res);
});

//not found
router.get('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = router;
