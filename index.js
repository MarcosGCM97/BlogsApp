require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const url = process.env.MONGODB_URL

app.get('/', (request, response)=>{
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/blogs', (request, response)=>{
    Blog.find({}).then(blogs => {
      response.json(blogs)
    })
})

app.get('/api/blogs/:id', (request, response)=>{
  const id = request.params.id

  Blog.findById(id).then(blog => {
      response.json(blog)    
  }).catch(error => 
      response.status(404).end()
    )
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

  response.json(blog)
})

app.delete('/api/blogs/:id', (request, response)=>{
  const id = request.params.id

  Blog.findByIdAndDelete(id)
    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})