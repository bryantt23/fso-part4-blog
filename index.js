const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { info, error } = require('./utils/logger');
const { tokenExtractor, userExtractor } = require('./utils/requestToken');
const { PORT, MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');
mongoose.connect(MONGODB_URI);
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use(userExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  // Handle other types of errors or pass them along
  next(error);
});

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});

module.exports = app;
