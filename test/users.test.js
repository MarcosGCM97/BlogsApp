const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const list_helper = require('../utils/list_helper')
const assert = require('assert')


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'rotito', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await list_helper.usersInDb()

    const newUser = {
      username: 'german',
      name: 'beder',
      password: 'bederito'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await list_helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
    /*const resPost = await api.post('/api/users').send(newUser)
    const thisPost = resPost.statusCode
    expect(thisPost).toBe(201)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd._body.length).toBe(usersAtStart._body.length + 1)

    const usersnames = usersAtEnd._body.map(u => u.username)
    expect(usersnames).toContain(newUser.username)*/
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    expect(result.body.error).toContain('expected `username` to be unique')

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})