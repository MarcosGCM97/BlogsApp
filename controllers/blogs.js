const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch(error){
    next(error)
  }
})


blogsRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id

  try{
    const blog = await Blog.findById(id)
    if(blog){
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch(error){
    next(error)
  }
})



blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    author: body.author,
    title: body.title,
    URL: body.URL,
    like: body.like || 0
  })
  try{
    const savedBlog = await blog.save()
    response.json(savedBlog)
  } catch(error){
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { author, title, URL, like } = request.body

  try{
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { author, title, URL, like },
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter