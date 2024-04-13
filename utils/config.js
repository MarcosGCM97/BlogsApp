require('dotenv').config()

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
// eslint-disable-next-line no-undef
const url = process.env.NODE_ENV === 'test'
  // eslint-disable-next-line no-undef
  ? process.env.TEST_MONGODB_URI
  // eslint-disable-next-line no-undef
  : process.env.MONGODB_URI

module.exports = {
  PORT,
  url
}