require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: '50mb' }));


app.listen(3001, 'localhost', () => {
  console.log('api start : http://localhost:3001');
});
