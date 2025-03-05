import express from 'express';
import entryRouter from './routes/entry-router.js';
import userRouter from './routes/user-router.js';
import medicationRouter from './routes/medication-router.js';
import exerciseRouter from './routes/exercise-router.js';
import authRouter from './routes/auth-router.js';
import cors from 'cors';
import { notFoundHandler, errorHandler } from './middlewares/error-handler.js';


const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.use(cors());
app.use('/', express.static('src/public'));
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/entries', entryRouter);
app.use('/api/medications', medicationRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/auth', authRouter);


// 404 virheitä varten
app.use(notFoundHandler);



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
});

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

// yleinen virhevastausten lähettäjä kaikkia virhetilanteita varten
app.use(errorHandler);