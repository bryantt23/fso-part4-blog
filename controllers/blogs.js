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
    if (!request.token) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = request.user;
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
  try {
    // Check if user is extracted from the token
    if (!request.user) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    // Find the blog
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    // Check if the blog's user matches the authenticated user
    if (blog.user.toString() !== request.user._id.toString()) {
      return response
        .status(401)
        .json({ error: 'only the creator can delete a blog' });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(request.params.id);

    // Remove the blog from the user's list of blogs
    await User.findByIdAndUpdate(request.user._id, {
      $pull: { blogs: blog._id }
    });

    response.status(204).end();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'invalid token' });
    }
    response.status(500).json({ error: 'internal server error' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body);
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
