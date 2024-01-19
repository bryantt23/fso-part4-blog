const { body, validationResult } = require('express-validator');
const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const bcrypt = require('bcryptjs');

usersRouter.post(
  '/',
  [
    body('username', 'Username must be at least 3 characters long').isLength({
      min: 3
    }),
    [body('name', 'Invalid name').notEmpty()],
    [
      body('password', 'Password must be at least 3 characters long').isLength({
        min: 3
      })
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing password' });
        }

        const user = new User({
          username: req.body.username,
          name: req.body.name,
          password: hashedPassword
        });

        const result = await user.save();
        res
          .status(201)
          .json({ message: 'User created successfully', userId: result._id });
      });
    } catch (error) {
      return next(error);
    }
  }
);

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('blogs');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = usersRouter;
