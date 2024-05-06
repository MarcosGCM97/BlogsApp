require('dotenv').config()
const process = require('process')

const PORT = process.env.PORT
const url = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  PORT,
  url
}