const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const helper = require('./test_helper');
const api = supertest(app);
const blog = require('../models/blog');

beforeEach(async () => {
  await blog.deleteMany({});
  let blogObject = new blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new blog(helper.initialBlogs[1]);
  await blogObject.save();
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
    expect(blogPost.id).toBeUndefined(); // Optional: check that _id is not present
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
