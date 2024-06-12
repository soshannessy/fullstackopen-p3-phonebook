const express = require('express');
const app = express();
require('dotenv').config();

const Person = require('./models/person');

app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Provide Name or Number' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
