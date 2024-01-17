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

afterAll(async () => {
  await mongoose.connection.close();
});
