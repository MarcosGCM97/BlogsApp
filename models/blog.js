const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  author: {
    type: String,
    minLength: 3,
    required: true
  },
  title: {
    type: String,
    minLength: 3,
    required: true
  },
  URL: {
    type: String,
    minLength: 6,
    required: true
  },
  like: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)