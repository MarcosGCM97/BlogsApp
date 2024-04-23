const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    URL: 'https://reactpatterns.com/',
    like: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    URL: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    like: 5,
    __v: 0
  }
]
const newBlog = {
  author: 'Edsger W. Dijkstra',
  title: 'hola que tal',
  URL: 'http://www.holaquetal.com'
}
const badBlog = {
  author: 'Marcos Congregado',
  title: '',
  URL: ''
}

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
}, 10000)

test('all blogs are returned', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('GET/blogs', () => {

  test('there are two', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const author = response.body.map(r => r.author)
    expect(author).toContain('Michael Chan')
  })
})

describe('POST/blogs', () => {
  test('successful request post and added to database', async () => {
    const resPost = await api.post('/api/blogs').send(newBlog)
    const resGet = await api.get('/api/blogs')


    const thisBlog = resPost.statusCode
    expect(thisBlog).toBe(201)

    const length = resGet.body.length
    expect(resGet.body[length-1]).toMatchObject(newBlog)
  })

  test('default value of Like property', async () => {
    await api.post('/api/blogs').send(newBlog)
    const response = await api.get('/api/blogs')

    const length = response.body.length
    const thisBlog = response.body[length-1]

    expect(thisBlog.like).toBe(0)
  })

  test('error 400 Bad Request from POST request', async () => {
    const response = await api.post('/api/blogs').send(badBlog)

    expect(response.statusCode).toBe(400)
  })
})

describe('DELETE/UPDATE request', () => {
  test('Delete a specific blog', async () => {
    await api.delete(`/api/blogs/${initialBlogs[1]._id}`)
    const resGET = await api.get('/api/blogs')

    const blog = resGET.body.find(blog => blog.id === initialBlogs[1]._id)

    expect(blog).toBeUndefined()
  })

  test('update Like property of a specific blog', async () => {
    let updateThis = initialBlogs[0]
    updateThis.like += 1

    await api.put(`/api/blogs/${initialBlogs[0]._id}`)
      .send({ like : updateThis.like })
    const response = await api.get('/api/blogs')

    console.log(updateThis)
    expect(response.body[0].like).toBe(8)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})