require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const url = process.env.MONGODB_URL

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformated id' })
  }

  next(error)
}

app.use(errorHandler)

app.get('/', (request, response)=>{
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/blogs', (request, response)=>{
    Blog.find({}).then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.get('/api/blogs/:id', (request, response, next)=>{
  const id = request.params.id

  Blog.findById(id).then(blog => {
    if(blogs){
      response.json(blogs)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
}) 

const generateID =()=>{
  const maxId = String(Math.floor(Math.random() * 100))
  
  return maxId;
}

app.post('/api/blogs',(request, response)=>{
    const body = request.body


    if(!body.author){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const blog = new Blog({
        author: body.author,
        title: body.title,
        URL: body.URL,
        like: body.like || 0,
        id: generateID()
    })

    blog.save().then(savedBlog=>{
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

app.put('/api/person/:id', (request, response)=>{
  const body = request.body

  const blog = {
    author: body.author,
    title: body.title,
    URL: body.URL,
    like: body.like,
    id: body.id
  }

  Blog.findByIdAndUpdate(body.id, blog, { new: true })
    then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

app.delete('/api/blogs/:id', (request, response)=>{
  const id = request.params.id

  Blog.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})