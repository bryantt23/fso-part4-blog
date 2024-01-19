const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const api = supertest(app);
const helper = require('./test_helper');

const testUser = {
  username: 'testuser',
  password: 'testpassword',
  name: 'Test User'
};
let token; // Token for authenticated requests
let user; // User for the test cases

beforeAll(async () => {
  await User.deleteMany({});

  user = new User(testUser);
  await user.save();

  // Generate a token for the test user
  const userForToken = {
    username: testUser.username,
    id: user._id
  };
  token = jwt.sign(userForToken, process.env.SECRET);
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(
    blog => new Blog({ ...blog, user: user._id })
  );
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(b => b.title);
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
    .set('Authorization', `Bearer ${token}`)
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

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('blog without url is not added and returns status 400', async () => {
  const newBlogWithoutUrl = {
    title: 'No URL',
    author: 'Missing URL',
    likes: 2
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400);

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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const createdBlog = createdBlogResponse.body;

  // Delete the created blog post
  await api
    .delete(`/api/blogs/${createdBlog._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204); // 204 No Content is a common response for successful DELETE operations

  // Verify that the blog post has been deleted
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  expect(blogsAtEnd.map(b => b._id)).not.toContain(createdBlog.id);
});

test('number of likes for a blog post can be updated', async () => {
  // Create a new blog post
  const newBlog = {
    title: 'Blog to Update',
    author: 'Updater',
    url: 'http://toupdate.com',
    likes: 1
  };

  const createdBlogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const createdBlog = createdBlogResponse.body;

  // Update the likes of the created blog post
  const updatedBlog = {
    ...createdBlog,
    likes: 2 // Increment likes
  };

  await api.put(`/api/blogs/${createdBlog._id}`).send(updatedBlog).expect(200);

  // Fetch the updated blog post and verify the likes
  const updatedBlogResponse = await api.get(`/api/blogs/${createdBlog._id}`);
  expect(updatedBlogResponse.body.likes).toBe(2);
});

afterAll(async () => {
  await mongoose.connection.close();
});
