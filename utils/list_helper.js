

const dummy = (blogs) => {

  return blogs.length
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  const result = blogs.length === 1
    ? blogs[0].likes
    : blogs.reduce(reducer, 0)

  return result
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const mostLikes = Math.max(...likes)

  const result = blogs.find(blog => blog.likes === mostLikes)

  return result
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)

  const authorBlogs = authors.reduce((quantity, author) => {
    quantity[author] = (quantity[author] || 0) + 1
    return quantity
  }, {})

  const arrAuthors = Object.entries(authorBlogs).map(([author, blogs]) => ({
    author, blogs
  }))

  const valueBlogs = arrAuthors.map(author => author.blogs)

  const isThis = arrAuthors.find(author => author.blogs === (Math.max(...valueBlogs)))

  return isThis
}

const mostLikes = (blogs) => {
  const likesBlogs = blogs.reduce((quantity, blog) => {
    quantity[blog.author] = (quantity[blog.author] || 0) + blog.likes
    return quantity
  }, {})

  const arrLikes = Object.entries(likesBlogs).map(([author, likes]) => ({
    author, likes
  }))

  const valuesLikes = arrLikes.map(like => like.likes)

  const isThis = arrLikes.find(mostLiked => mostLiked.likes === (Math.max(...valuesLikes)))

  return isThis
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}