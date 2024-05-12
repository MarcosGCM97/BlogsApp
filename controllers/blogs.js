const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')
//const process = require('process')

/*const userExtractor = async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  return user
}*/

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  const user = await request.user

  const blog = new Blog({
    author: body.author,
    title: body.title,
    URL: body.URL,
    like: body.like || 0,
    user: user.id
  })

  try{
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(error){
    next(error)
  }
})

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.find({})
      .populate('user', { username: 1, name: 1 })

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const id = request.params.id
  try{
    const user = await request.user
    const blog = await Blog.findById(id)

    if(blog.user.toString() === user._id.toString()){
      await Blog.findByIdAndDelete(id)
      response.status(204).end()
    } else{
      response.status(401).json({ error: 'token invalid' }).end()
    }
  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter