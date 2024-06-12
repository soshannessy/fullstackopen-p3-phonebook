const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://samoshannessy:${password}@cluster0.rwzjzp3.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

console.log('Connecting to MongoDB...');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.argv.length === 3) {
      return fetchAllPersons();
    } else if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];
      return addNewPerson(name, number);
    } else {
      console.log('Please provide both name and number to add a new person.');
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const addNewPerson = (name, number) => {
  const newPerson = new Person({ name, number });

  return newPerson.save()
    .then(result => {
      console.log(`Added ${name} number ${number} to phonebook`);
      return fetchAllPersons();
    })
    .catch(error => {
      console.error('Error adding person:', error.message);
      mongoose.connection.close();
    });
};

const fetchAllPersons = () => {
  return Person.find({})
    .then(result => {
      console.log('Phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};
