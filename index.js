const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { info, error } = require('./utils/logger');
const { PORT, MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');
mongoose.connect(MONGODB_URI);
const blogsRouter = require('./controllers/blogs');

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
