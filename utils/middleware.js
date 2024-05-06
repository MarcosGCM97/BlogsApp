const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const process = require('process')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

const errorHandler = (error, response, next) => {
  logger.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformated id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error collection')){
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if(error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next()
}

const tokenExtractor = async (request, error, next) => {
  const authorization = await request.get('authorization')

  if(authorization && authorization.startsWith('Bearer ')){
    const token = authorization.replace('Bearer ', '')
    request.token = token
  }
  next()
}

const userExtractor = async (request, response, next) => {
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'Missing user' })
    }
    request.userToken = user
    next()
  } catch(error){
    return response.status(401).json({ error: 'token invalid' })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}