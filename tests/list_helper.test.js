const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ];
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
  // Test with empty list of blogs
  test('of empty list is zero', () => {
    const emptyList = [];
    const result = listHelper.totalLikes(emptyList);
    expect(result).toBe(0);
  });

  // Test with multiple blogs
  test('when list has multiple blogs, equals the sum of likes', () => {
    const multipleBlogs = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
      }
    ];
    const result = listHelper.totalLikes(multipleBlogs);
    expect(result).toBe(24);
  });

  // Test with blogs having no likes
  test('when blogs have no likes, equals zero', () => {
    const noLikesBlogs = [
      {
        _id: '5a422b891b54a676234d17fa',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 0,
        __v: 0
      },
      {
        _id: '5a422ba71b54a676234d17fb',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        __v: 0
      }
    ];
    const result = listHelper.totalLikes(noLikesBlogs);
    expect(result).toBe(0);
  });
});

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
  ];

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBeNull();
  });

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog([blogs[0]]);
    console.log('🚀 ~ test ~ result:', result);
    expect(result).toEqual(blogs[0]);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });

  test('of a list with multiple top favorites returns one of them', () => {
    const multipleTopFavorites = [
      ...blogs,
      {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 12,
        __v: 0
      }
    ];
    const result = listHelper.favoriteBlog(multipleTopFavorites);
    expect(result.likes).toBe(12);
  });
});

describe('most blogs', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Code smells',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2014/05/08/CodeSmells.html',
      likes: 2,
      __v: 0
    }
  ];

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBeNull();
  });

  test('when list has only one blog, returns that author with one blog', () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    });
  });

  test('of a bigger list is calculated right, identifying the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    });
  });

  test('of a list where multiple authors have the same highest number of blogs returns one of them', () => {
    // Adding an additional blog for 'Edsger W. Dijkstra' to create a tie
    const blogsTie = [
      ...blogs,
      {
        _id: '5a422bc61b54a676234d17fd',
        title: 'Structure and Interpretation of Computer Programs',
        author: 'Edsger W. Dijkstra',
        url: 'http://mitpress.mit.edu/sicp/',
        likes: 3,
        __v: 0
      }
    ];
    const result = listHelper.mostBlogs(blogsTie);
    expect(result.blogs).toBe(3);
    // Since it's a tie, the test could either expect 'Robert C. Martin' or 'Edsger W. Dijkstra'
    expect(['Robert C. Martin', 'Edsger W. Dijkstra']).toContain(result.author);
  });
});
