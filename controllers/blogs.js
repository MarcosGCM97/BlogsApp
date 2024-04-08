const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {

  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
    .catch(error => next(error))
})


blogsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id

  Blog.findById(id).then(blog => {
    if(blog){
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})


blogsRouter.post('/',(request, response, next) => {
  const body = request.body

  const blog = new Blog({
    author: body.author,
    title: body.title,
    URL: body.URL,
    like: body.like || 0
  })
  blog.save().then(savedBlog => {
    response.json(savedBlog)
  })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { author, title, URL, like } = request.body

  Blog.findByIdAndUpdate(
    request.params.id,
    { author, title, URL, like },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {

  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = blogsRouter