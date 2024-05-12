const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)
const User = require('../models/user')
const list_helper = require('../utils/list_helper')
const assert = require('assert')


beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'rotito', passwordHash })

  await user.save()
})

test('get json web token', async () => {
  const user = {
    username: 'root',
    password: 'sekret'
  }

  const goodPost = await api
    .post('/api/login')
    .send(user)

  expect(goodPost.statusCode).toBe(200)
})

describe('when there is initially one user in db', () => {

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

    const usernames = await (await list_helper.usersInDb()).map(user => user.username)
    console.log(usernames)
    assert(usernames.includes(newUser.username))

  })

  test('creation fails with proper statuscode and message if username already taken', async () => {

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
    console.log(result.body)

    assert(result.body.error.includes('expected `username` to be unique'))

  })
})


afterAll(async () => {
  await mongoose.connection.close()
})