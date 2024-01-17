const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const helper = require('./test_helper');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blogItem of helper.initialBlogs) {
    let blogObject = new Blog(blogItem);
    await blogObject.save();
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');

  // Expect that the response contains an array
  expect(response.body).toBeInstanceOf(Array);

  // Check each blog post in the response
  response.body.forEach(blogPost => {
    expect(blogPost._id).toBeDefined();
    expect(blogPost.id).toBeUndefined(); // Check that id is not present
  });
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(r => r.title);
  expect(titles).toContain('Test Blog');
});

test('likes property defaults to 0 if missing', async () => {
  const newBlogWithoutLikes = {
    title: 'Blog Without Likes',
    author: 'No Liker',
    url: 'http://nolikes.com'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  // Check that the likes property is defined and set to 0
  expect(response.body.likes).toBeDefined();
  expect(response.body.likes).toBe(0);
});

test('blog without title is not added and returns status 400', async () => {
  const newBlogWithoutTitle = {
    author: 'No Title',
    url: 'http://notitle.com',
    likes: 4
  };

  await api.post('/api/blogs').send(newBlogWithoutTitle).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('blog without url is not added and returns status 400', async () => {
  const newBlogWithoutUrl = {
    title: 'No URL',
    author: 'Missing URL',
    likes: 2
  };

  await api.post('/api/blogs').send(newBlogWithoutUrl).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('a blog post can be deleted', async () => {
  // Create a new blog post
  const newBlog = {
    title: 'Blog to be deleted',
    author: 'Deleter',
    url: 'http://tobedeleted.com',
    likes: 1
  };

  const createdBlogResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const createdBlog = createdBlogResponse.body;

  // Delete the created blog post
  await api.delete(`/api/blogs/${createdBlog._id}`).expect(204); // 204 No Content is a common response for successful DELETE operations

  // Verify that the blog post has been deleted
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  expect(blogsAtEnd.map(b => b._id)).not.toContain(createdBlog.id);
});

afterAll(async () => {
  await mongoose.connection.close();
});
