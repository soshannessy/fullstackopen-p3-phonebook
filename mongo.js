const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://samoshannessy:${password}@cluster0.rwzjzp3.mongodb.net/persons?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const addNewPerson = (name, number) => {
  const newPerson = new Person({
    name,
    number,
  });

  return newPerson.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
  });
};

const fetchAllPersons = () => {
  return Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
  }).finally(() => {
    mongoose.connection.close();
  });
};

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  addNewPerson(name, number).then(() => fetchAllPersons());
} else if (process.argv.length === 3) {
  fetchAllPersons();
}