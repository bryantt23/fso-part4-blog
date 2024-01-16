const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((prev, cur) => {
    const likes = cur.likes ? cur.likes : 0;
    return prev + likes;
  }, 0);
};

module.exports = {
  dummy,
  totalLikes
};
