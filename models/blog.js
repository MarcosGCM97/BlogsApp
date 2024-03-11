const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('conectiong to', url);

mongoose.connect(url)
    .then(result=>{
        console.log('connected to MongoDB')
    })
    .catch((error)=>{
        console.log('error connecting to MongoDB:', error.message)
    })

const blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    URL: String,
    like: Number
})

blogSchema.set('toJSON', {
    transform: (docuemnt, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)