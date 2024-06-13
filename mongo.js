const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://samoshannessy:${password}@cluster0.rwzjzp3.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)
  
  const person = new Person({
    name: 'Demo Name',
    number: '123123123'
  })
  
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
})
