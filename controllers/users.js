const { body, validationResult } = require('express-validator');
const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

usersRouter.post(
  '/sign-up',
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

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  console.log(
    '🚀 ~ usersRouter.post ~  username, password:',
    username,
    password
  );

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = { username: user.username, id: user._id };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('blogs');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = usersRouter;
