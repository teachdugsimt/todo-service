const moment = require('moment');
const models = require('../models');
const SubTaskRepository = require('../src/SubTaskRepository');

const subtaskRepository = new SubTaskRepository();
const MOMENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const time = moment(new Date()).format(MOMENT_DATE_FORMAT);

describe('Test Sub Task Repository', () => {

  describe('Test Delete Function', () => {
    test('Should be return object when delete sub task was success', async () => {
      const model = await models;
      model.sub_task.destroy = jest.fn(async () => {
        return 1;
      });

      const id = 9;
      const result = await subtaskRepository.deleteSubTask(id);
      expect(result).toEqual(1);
    });

    test('Should be throw error 500 when sub task id is null', async () => {
      const model = await models;
      model.sub_task.destroy = jest.fn(async () => {
        return Promise.reject({ status: 500 });
      });
      let result, err;
      try {
        result = await subtaskRepository.deleteSubTask();
      } catch (error) {
        err = error;
      }
      expect(!result).toBeTruthy();
      expect(err).toBeTruthy();
      expect(err.status).toEqual(500);
    });

    test('Should be throw error 500 when model.sub_task throw error', async () => {
      const model = await models;
      model.sub_task.destroy = jest.fn(async () => {
        return Promise.reject({
          status: 500,
          name: 'SequelizeDatabaseError',
          errorMessage: `${subtaskRepository.name} error: ${subtaskRepository.deleteSubTask.name} function`,
        });
      });
      const id = 9;
      let result, err;
      try {
        result = await subtaskRepository.deleteSubTask(id);
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
        title: 'One create web application',
        todoId: 1
      };

      const expectedValue = {
        id: 1,
        title: "One create web application",
        status: "PENDING",
        created_at: time,
        todoId: 1
      }

      const model = await models;
      model.sub_task.create = jest.fn(async () => {
        return expectedValue;
      });

      const result = await subtaskRepository.create(data);
      expect(result).toMatchObject(expectedValue);
    });


    test('Should be throw error 500 when model sub_task throw error with id 99', async () => {
      const model = await models;
      const expectedValue = {
        status: 500,
        errorMessage: 'SubTaskRepository error: create function',
      };
      model.todo.update = jest.fn(async () => {
        return Promise.reject(expectedValue);
      });

      const data = {
        title: 'Sub task 1',
        todoId: 1
      };

      let response;
      try {
        await subtaskRepository.create(data);
      } catch (error) {
        response = error;
      }
      model.todo.update.mockReset();
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedValue);
    });


    test('Should be throw error 500 when data was wrong autoIncrement', async () => {
      const data = {
        title: 'Second course',
        todo_id: 1
      };

      const expectedValue = {
        status: 500,
        name: 'SequelizeUniqueConstraintError',
        errorMessage: 'SubTaskRepository error: create function',
      };

      const model = await models;
      model.sub_task.create = jest.fn(async () => {
        throw expectedValue;
      });

      let response;
      try {
        await subtaskRepository.create(data);
      } catch (error) {
        response = error;
      }
      expect(response).toMatchObject(expectedValue);
    });
  });

  describe('Test Update Function', () => {
    test('Should be return 1 when update success with sub task id = 98 and todo id = 22 (have another subtask status = pending)', async () => {
      const data = {
        "updateBody": {
          "status": "COMPLETED"
        },
        "currentTodoStatus": "PENDING",
        "todoId": 22,
        "subtasks": [
          {
            "id": 98,
            "title": "2 of First todo",
            "status": "PENDING",
            "created_at": time,
            "todo_id": 22
          },
          {
            "id": 95,
            "title": "2 of First todo",
            "status": "PENDING",
            "created_at": time,
            "todo_id": 22
          }
        ]
      };

      const condition = {
        where: {
          id: 98,
        },
      };

      const model = await models;
      model.sub_task.update = jest.fn(async () => [1]);
      model.todo.update = jest.fn(async () => [1]);

      const result = await subtaskRepository.updateSubTask(data, condition);
      expect(result[0]).toEqual(1);
    });

    test('Should be return 1 when update success with sub task id = 11 and todo id = 1', async () => {
      const data = {
        "updateBody": {
          "status": "PENDING"
        },
        "currentTodoStatus": "COMPLETED",
        "todoId": 1,
        "subtasks": [
          {
            "id": 11,
            "title": "2 of First todo",
            "status": "COMPLETED",
            "created_at": "2021-12-15T18:33:46.000Z",
            "todo_id": 1
          }
        ]
      };

      const condition = {
        where: {
          id: 11,
        },
      };

      const model = await models;
      model.sub_task.update = jest.fn(async () => [1]);
      model.todo.update = jest.fn(async () => [1]);

      const result = await subtaskRepository.updateSubTask(data, condition);
      expect(result[0]).toEqual(1);
    });

    test('Should be throw error when sequelize response error', async () => {
      const model = await models;
      model.sub_task.update = jest.fn(async () => {
        throw {};
      });
      const expectedValue = {
        status: 500,
        errorMessage: 'SubTaskRepository error: updateSubTask function',
      };

      const data = {
        "updateBody": {
          "status": "COMPLETED"
        },
        "currentTodoStatus": "PENDING",
        "todoId": 2,
        "subtasks": [
          {
            "id": 57,
            "title": "2 of First todo",
            "status": "PENDING",
            "created_at": "2021-12-15T18:33:46.000Z",
            "todo_id": 2
          }
        ]
      };

      const condition = {
        where: {
          id: 57,
        },
      };

      let response;
      try {
        await subtaskRepository.updateSubTask(data, condition);
      } catch (error) {
        response = error;
      }
      model.sub_task.update.mockReset();
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedValue);
    });

    test('Should be throw error when model_todo throw error with sub task id = 20 and todo id = 3', async () => {
      const data = {
        "updateBody": {
          "status": "PENDING"
        },
        "currentTodoStatus": "COMPLETED",
        "todoId": 3,
        "subtasks": [
          {
            "id": 20,
            "title": "2 of First todo",
            "status": "COMPLETED",
            "created_at": "2021-12-15T18:33:46.000Z",
            "todo_id": 3
          }
        ]
      };

      const condition = {
        where: {
          id: 20,
        },
      };

      const expectedValue = {
        status: 500,
        errorMessage: 'SubTaskRepository error: updateSubTask function',
      };

      const model = await models;
      model.sub_task.update = jest.fn(async () => [1]);
      model.todo.update = jest.fn(async () => {
        throw {};
      });

      let response;
      try {
        await subtaskRepository.updateSubTask(data, condition);
      } catch (error) {
        response = error;
      }
      model.todo.update.mockReset();
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedValue);
    });

    test('Should be throw error when model_todo throw error with sub task id = 55 and todo id = 15', async () => {
     const data = {
        "updateBody": {
          "status": "COMPLETED"
        },
        "currentTodoStatus": "PENDING",
        "todoId": 15,
        "subtasks": [
          {
            "id": 55,
            "title": "2 of First todo",
            "status": "PENDING",
            "created_at": "2021-12-15T18:33:46.000Z",
            "todo_id": 15
          }
        ]
      };

      const condition = {
        where: {
          id: 55,
        },
      };

      const expectedValue = {
        status: 500,
        errorMessage: 'SubTaskRepository error: updateSubTask function',
      };

      const model = await models;
      model.sub_task.update = jest.fn(async () => [1]);
      model.todo.update = jest.fn(async () => {
        throw {};
      });

      let response;
      try {
        await subtaskRepository.updateSubTask(data, condition);
      } catch (error) {
        response = error;
      }
      model.todo.update.mockReset();
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedValue);
    });


  });

});
