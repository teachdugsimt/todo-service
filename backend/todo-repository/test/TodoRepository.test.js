const moment = require('moment');
const models = require('../models');
const TodoRepository = require('../src/TodoRepository');

const todoRepository = new TodoRepository();
const MOMENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const time = moment(new Date()).format(MOMENT_DATE_FORMAT);

describe('Test Todo Repository', () => {

  describe('Test Delete Function', () => {
    test('Should be return object when delete todo was success', async () => {
      const model = await models;
      model.todo.destroy = jest.fn(async () => {
        return 1;
      });
      model.sub_task.destroy = jest.fn(async () => {
        return 1;
      });
      const id = 9;
      const result = await todoRepository.deleteTodo(id);
      expect(result).toEqual(1);
    });

    test('Should be throw error 500 when todo id is null', async () => {
      const model = await models;
      model.todo.destroy = jest.fn(async () => {
        return Promise.reject({ status: 500 });
      });
      let result, err;
      try {
        result = await todoRepository.deleteTodo();
      } catch (error) {
        err = error;
      }
      expect(!result).toBeTruthy();
      expect(err).toBeTruthy();
      expect(err.status).toEqual(500);
    });

    test('Should be throw error 500 when model.todo throw error', async () => {
      const model = await models;
      model.todo.destroy = jest.fn(async () => {
        return Promise.reject({
          status: 500,
          name: 'SequelizeDatabaseError',
          errorMessage: `${todoRepository.name} error: ${todoRepository.deleteTodo.name} function`,
        });
      });
      const id = 9;
      let result, err;
      try {
        result = await todoRepository.deleteTodo(id);
      } catch (error) {
        err = error;
      }
      expect(!result).toBeTruthy();
      model.todo.destroy.mockReset();
      expect(err).toBeTruthy();
    });

    test('Should be throw error 500 when model.sub_task throw error', async () => {
      const model = await models;
      model.todo.destroy = jest.fn(async () => {
        return 1;
      });
      model.sub_task.destroy = jest.fn(async () => {
        return Promise.reject({
          status: 500,
          name: 'SequelizeDatabaseError',
          errorMessage: `${todoRepository.name} error: ${todoRepository.deleteTodo.name} function`,
        });
      });
      const id = 9;
      let result, err;
      try {
        result = await todoRepository.deleteTodo(id);
      } catch (error) {
        err = error;
      }
      expect(!result).toBeTruthy();
      model.sub_task.destroy.mockReset();
      expect(err).toBeTruthy();
    });
  });

  describe('Test Create Function', () => {
    test('Should be return data when create success', async () => {
      const data = {
        title: 'Main course'
      };

      const expectedValue = {
        id: 1,
        title: 'Main course',
        status: 'PENDING',
        created_at: time,
        updated_at: time,
      };

      const model = await models;
      model.todo.create = jest.fn(async () => {
        return expectedValue;
      });

      const result = await todoRepository.create(data);
      expect(result).toMatchObject(expectedValue);
    });

    test('Should be throw error 500 when data was wrong autoIncrement', async () => {
      const data = {
        title: 'Second course'
      };

      const expectedValue = {
        status: 500,
        name: 'SequelizeUniqueConstraintError',
        errorMessage: 'TodoRepository error: create function',
      };

      const model = await models;
      model.todo.create = jest.fn(async () => {
        throw expectedValue;
      });

      let response;
      try {
        await todoRepository.create(data);
      } catch (error) {
        response = error;
      }
      expect(response).toMatchObject(expectedValue);
    });
  });

  describe('Test Update Function', () => {
    test('Should be return 1 when update success with id = 999', async () => {
      const data = {
        status: 'COMPLETED',
      };

      const condition = {
        where: {
          id: 999,
        },
      };

      const model = await models;
      model.todo.update = jest.fn(async () => [1]);
      model.sub_task.update = jest.fn(async () => [1]);

      const result = await todoRepository.updateTodo(data, condition);

      expect(result[0]).toEqual(1);
    });

    test('Should be return 1 when update success with id = 998', async () => {
      const data = {
        status: 'PENDING',
      };

      const condition = {
        where: {
          id: 998,
        },
      };

      const model = await models;
      model.todo.update = jest.fn(async () => [1]);
      model.sub_task.update = jest.fn(async () => [1]);

      const result = await todoRepository.updateTodo(data, condition);

      expect(result[0]).toEqual(1);
    });

    test('Should be return 1 when update success with id = 997', async () => {
      const data = {
        status: 'EDIT',
      };

      const condition = {
        where: {
          id: 997,
        },
      };

      const model = await models;
      model.todo.update = jest.fn(async () => [1]);

      const result = await todoRepository.updateTodo(data, condition);

      expect(result[0]).toEqual(1);
    });

    test('Should be return 0 when update fail with id = 9999', async () => {
      const data = {
        status: 'PENDING',
      };

      const condition = {
        where: {
          id: 9999,
        },
      };

      const model = await models;
      model.todo.update = jest.fn(async () => [0]);

      const result = await todoRepository.updateTodo(data, condition);

      expect(result[0]).toEqual(0);
    });

    test('Should be throw error 500 when model sub_task throw error with id 99', async () => {
      const model = await models;
      const expectedValue = {
        status: 500,
        errorMessage: 'TodoRepository error: updateTodo function',
      };
      model.sub_task.update = jest.fn(async () => {
        return Promise.reject(expectedValue);
      });

      const data = {
        status: 'COMPLETED',
      };

      const condition = {
        where: {
          id: 99,
        },
      };

      let response;
      try {
        await todoRepository.updateTodo(data, condition);
      } catch (error) {
        response = error;
      }
      model.sub_task.update.mockReset();
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedValue);
    });

    test('Should be throw error when sequelize response error', async () => {
      const model = await models;
      model.todo.update = jest.fn(async () => {
        throw {};
      });
      const expectedValue = {
        status: 500,
        errorMessage: 'TodoRepository error: updateTodo function',
      };

      const data = {
        status: 'COMPLETED',
      };

      const condition = {
        where: {
          id: 9999,
        },
      };

      let response;
      try {
        await todoRepository.updateTodo(data, condition);
      } catch (error) {
        response = error;
      }
      model.todo.update.mockReset();
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedValue);
    });
  });

  describe('Test FindAll With Relations Function', () => {
    test('Should be return list todo object when find all success', async () => {
      const model = await models;
      const expectedValue = [
        {
          "id": 1,
          "title": "First todo",
          "status": "PENDING",
          "created_at": "2021-12-13T19:12:11.000Z",
          "updated_at": "2021-12-13T19:12:11.000Z",
          "sub_tasks": [
            {
              "id": 1,
              "title": "One create web application",
              "status": "PENDING",
              "created_at": "2021-12-13T19:13:47.000Z",
              "todo_id": 1
            },
            {
              "id": 2,
              "title": "Two create database",
              "status": "PENDING",
              "created_at": "2021-12-13T19:14:22.000Z",
              "todo_id": 1
            },
            {
              "id": 3,
              "title": "Three create api",
              "status": "PENDING",
              "created_at": "2021-12-13T19:14:46.000Z",
              "todo_id": 1
            },
            {
              "id": 5,
              "title": "Four unit test",
              "status": "COMPLETED",
              "created_at": "2021-12-13T21:36:41.000Z",
              "todo_id": 1
            }
          ]
        },
        {
          "id": 2,
          "title": "Second todo",
          "status": "PENDING",
          "created_at": "2021-12-13T19:12:30.000Z",
          "updated_at": "2021-12-13T19:12:30.000Z",
          "sub_tasks": []
        },
        {
          "id": 4,
          "title": "Fourth worshop",
          "status": "COMPLETED",
          "created_at": "2021-12-13T21:10:14.000Z",
          "updated_at": "2021-12-13T21:10:14.000Z",
          "sub_tasks": []
        },
        {
          "id": 3,
          "title": "Third todo",
          "status": "PENDING",
          "created_at": "2021-12-13T19:12:54.000Z",
          "updated_at": "2021-12-13T19:12:54.000Z",
          "sub_tasks": []
        }
      ]
      model.todo.findAll = jest.fn(async () => expectedValue);

      const data = await todoRepository.findAllTodoJoinSubTask();

      expect(data).toBeTruthy();
      expect(data.length).toEqual(4);
    })
    test('Should be return list todo object when find all success', async () => {
      const model = await models;
      const expectedValue = {
        status: 500,
        name: 'SequelizeUniqueConstraintError',
        errorMessage: 'TodoRepository error: findAllTodoJoinSubTask function',
      }
      model.todo.findAll = jest.fn(async () => {
        return Promise.reject({
          status: 500,
          name: 'SequelizeDatabaseError',
          errorMessage: `${todoRepository.name} error: ${todoRepository.findAllTodoJoinSubTask.name} function`,
        });
      });

      let result, err;
      try {
        result = await todoRepository.findAllTodoJoinSubTask();
      } catch (error) {
        err = error
      }

      expect(!result).toBeTruthy();
      model.todo.findAll.mockReset();
      expect(err).toBeTruthy();
    })
  })
});
