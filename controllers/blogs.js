const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

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
    const users = await User.find({});
    console.log('Users:', users);

    const userCount = await User.countDocuments();
    console.log('User Count:', userCount);

    // If there are no users, return an error
    if (userCount === 0) {
      return response.status(404).json({ error: 'No users found' });
    }

    // Generate a random number (0 to userCount - 1)
    const randomUserIndex = Math.floor(Math.random() * userCount);

    const randomUser = await User.findOne().skip(randomUserIndex);
    if (!randomUser) {
      return response.status(404).json({ error: 'User not found' });
    }

    const blogData = {
      ...request.body,
      user: randomUser._id
    };

    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    if (!randomUser.blogs) {
      randomUser.blogs = [];
    }
    randomUser.blogs = randomUser.blogs.concat(savedBlog._id);
    await randomUser.save();

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
