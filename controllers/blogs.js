const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);
    const blogData = {
      ...request.body,
      user: user._id
    };

    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    if (!user.blogs) {
      user.blogs = [];
    }
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body);
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
