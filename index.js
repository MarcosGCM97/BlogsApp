const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

blogs = [
    {
      "author": "Artur",
      "title": "guerra de dioses",
      "URL": "guerra.com",
      "like": 10,
      "id": "2dc9"
    },
    {
      "author": "Gustav",
      "title": "Sunami",
      "URL": "agua.com",
      "like": 11,
      "id": "4daf"
    },
    {
      "author": "Guillermina",
      "title": "the city",
      "URL": "provincia.com",
      "like": 12,
      "id": "fb4c"
    },
    {
      "author": "Jacobo",
      "title": "La Reina",
      "URL": "LaReina.com",
      "like": 3,
      "id": "6212"
    },
    {
      "author": "Jefrey",
      "title": "Nieve loca",
      "URL": "AllCrazy.com",
      "like": 3,
      "id": "a30b"
    }
]

app.get('/', (request, response)=>{
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/blogs', (request, response)=>{
    response.json(blogs)
})

app.get('/api/blogs/:id', (request, response)=>{
    const id = request.params.id
    const blog = (blogs.find(blog => blog.id === id))

    if(blog){
      response.json(blog)
    } else{
      response.status(404).end()
    }
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
    const blog = {
        author: body.author,
        title: body.title,
        URL: body.URL,
        like: body.like || 0,
        id: generateID()
    }

    blogs = blogs.concat(blog)

    response.json(blog)
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
    blogs = blogs.filter(blog => blog.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})