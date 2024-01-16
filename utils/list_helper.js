const _ = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((prev, cur) => {
    return prev + (cur.likes ?? 0);
  }, 0);
};

const favoriteBlog = blogs => {
  let mostLikes = 0,
    favBlog = null;
  for (const blog of blogs) {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes;
      favBlog = blog;
    }
  }
  return favBlog;
};

const mostBlogs = blogs => {
  if (!blogs.length) {
    return null;
  }
  const mostFrequent = _.chain(blogs)
    .countBy('author')
    .toPairs()
    .maxBy(_.last)
    .value();
  return { author: mostFrequent[0], blogs: mostFrequent[1] };
};

const mostLikes = blogs => {
  if (!blogs.length) {
    return null;
  }
  const authorLikes = _.chain(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, 'likes')
    }))
    .value();
  // Find the author with the most likes
  const mostLikedAuthor = _.maxBy(authorLikes, 'likes');
  return mostLikedAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
