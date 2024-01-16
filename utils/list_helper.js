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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
