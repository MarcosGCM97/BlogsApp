require('dotenv').config()

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URL

module.exports = {
  PORT,
  url
}