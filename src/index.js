import express from 'express';
import { getItems, addItems, getItemByID, putItemByID, delItemByID } from './items.js';
import { getUsers, addUser, getUserByID, login, changePassByID, delUserByID } from './users.js';

const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.use('/', express.static('src/public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/resource', (req, res) => {
  const myData = {title: 'This is an item', description: 'Just some dummy data here'};
  res.status(200).json(myData);
});

app.get('/api/resource/:id', (req, res) => {
  if (req.params.id === '99') {
    const myData = {
      title: 'This is a specific item, id: ' + req.params.id,
      description: 'Just some dummy data here',
    };
    res.status(200).json(myData);
  } else if (req.params.id === '77') {
    const myData = {
      title: 'You get bonus! id: ' + req.params.id,
      description: 'Just some game bonus',
    };
    res.status(200).json(myData);
  } else {
    res.status(404).send('Resource not found');
  }
});


//param summa
app.get('/api/summa/:num1/:num2', (req, res) => {
  console.log(req.params);
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  res.json({
    num1,
    num2,
    sum: num1 + num2,
  })
});

app.get('/api/', (req, res) => {
  console.log('get-pyyntö apin juureen havaittu');
  console.log(req.url);
  res.send('Welcome to my REST API')
})

app.get('/api/items', getItems);
app.get('/api/items/:id', getItemByID);
app.post('/api/items', addItems);
app.put('/api/items/:id', putItemByID);
app.delete('/api/items/:id', delItemByID);

app.get('/api/users', getUsers);
app.get('/api/users/:id', getUserByID);
app.post('/api/users/', addUser);
app.post('/api/users/login', login);
app.put('/api/users/:id', changePassByID);
app.delete('/api/users/:id', delUserByID);

//param ero

app.get('/api/ero/:num1/:num2', (req, res) => {
  console.log(req.params);
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  res.json({
    num1,
    num2,
    ero: num1 - num2,
  })
});

//kysely params
app.get('/api/summa/:num1/:num2', (req, res) => {
  console.log(req.params);
  const num1 = parseInt(req.query.num1);
  const num2 = parseInt(req.query.num2);
  res.json({
    num1,
    num2,
    sum: num1 + num2,
  })
});

app.post('/api/resource', (req, res) => {
  const body = req.body;
  res.status(201).json({
    message: 'Resource created successfully',
    your_request: body,
  });
});

app.post('/api/greet', (req, res) => {
  const body = req.body;
  res.status(201).json({
    message: 'Hello world!',
    your_request: body,
  });
});

app.delete('/api/resource/:id', (req, res) => {
  if (req.params.id === '99') {
    res.status(200).send('Resource deleted');
  } else {
    res.status(404).send('Resource not found');
  }
});

app.put('/api/resource/:id', (req, res) => {
  if (req.params.id === '99') {
    const updatedData = req.body;
    res.status(200).json({
      message: 'Resource updated',
      updatedData: updatedData,
    });
  } else {
    res.status(404).send('Resource not found');
  }
});



app.use((req, res) => {
  res.status(404).send('Resource not found');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});