const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument');
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://marcoscongregado:${password}@cluster0.meryxz7.mongodb.net/`

mongoose.set('strictQuery', false)
mongoose.connect(url)    

const blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    URL: String,
    like: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    author: 'Artur',
    title: 'La espada en la piedra',
    URL: 'LaEspadadeArtur.com',
    like: 2
})

blog.save().then(result => {
    console.log('blog saved!')
    mongoose.connection.close()
})