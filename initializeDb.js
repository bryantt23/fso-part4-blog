require('dotenv').config();
const mongoose = require('mongoose');

// Define the blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

// Create the model from the schema
const Blog = mongoose.model('Blog', blogSchema);

// Sample data to be inserted
const blogs = [
  {
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Statement_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  }
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Insert the sample data
    return Blog.insertMany(blogs);
  })
  .then(() => {
    console.log('Sample data inserted');
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });
