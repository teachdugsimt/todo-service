require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dJSON = require('dirty-json');
const TodoRepository = require('./todo-repository/src/TodoRepository')
const SubTaskRepository = require('./todo-repository/src/SubTaskRepository')
const todoRepository = new TodoRepository()
const subtaskRepository = new SubTaskRepository()
const api_path = '/api/v1/todo'

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: '50mb' }));

app.get(api_path, async (req, res) => {
  try {
    let { filter } = req.query || {};
    filter = typeof filter === 'string' ? dJSON.parse(filter) : filter;
    const response = await todoRepository.findAllTodoJoinSubTask(filter);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post(api_path, async (req, res) => {
  try {
    let body = typeof req.body === 'string' ? dJSON.parse(req.body) : req.body;
    const response = await todoRepository.create(body);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch(api_path + '/:id', async (req, res) => {
  try {
    let body = typeof req.body === 'string' ? dJSON.parse(req.body) : req.body;
    const response = await todoRepository.updateTodo(body, { where: { id: +req.params.id } });
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post(api_path + "/subtask", async (req, res) => {
  try {
    let body = typeof req.body === 'string' ? dJSON.parse(req.body) : req.body;
    const response = await subtaskRepository.create(body);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch(api_path + '/subtask/:id', async (req, res) => {
  try {
    let body = typeof req.body === 'string' ? dJSON.parse(req.body) : req.body;
    const response = await subtaskRepository.updateSubTask(body, { where: { id: +req.params.id } });
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3001, 'localhost', () => {
  console.log('api start : http://localhost:3001');
});
