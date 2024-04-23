const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try{
    const users = await User.find({})
      .populate('blogs', { author: 1, title: 1, URL: 1 })

    response.json(users)
  } catch(error){
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  if(password.length < 3){
    next(response.status(400).json({ error: 'content missing' }, ))
  } else {
    try{
      const user = new User ({
        username,
        name,
        passwordHash
      })

      const savedUser = await user.save()
      response.status(201).json(savedUser)
    }
    catch(error){
      next(error)
    }
  }

})

module.exports = usersRouter