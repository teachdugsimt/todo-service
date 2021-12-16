const InternalSequelizeError = require('./InternalSequelizeError');
var models = require('../models');

const STATUS_TODO = {
    "PENDING": "PENDING",
    "COMPLETED": "COMPLETED"
}
const list_status = ["PENDING", "COMPLETED"]
class TodoRepository {
    constructor() {
        this._entityname = TodoRepository.name;
    }

    async create(data) {
        const model = await models;
        const result = await model.todo.create(data).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.create.name, error);
        });
        return result;
    }

    async deleteTodo(id) {
        const model = await models;
        const result = await model.todo.destroy({ where: { id: id } }).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.deleteTodo.name, error);
        });
        await model.sub_task.destroy({ where: { todo_id: id } }).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.deleteTodo.name, error);
        });
        return result;
    }

    async updateTodo(data, condition) {
        const model = await models;
        const result = await model.todo.update({ ...data, updated_at: new Date() }, condition).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.updateTodo.name, error);
        });
        if (list_status.includes(data.status))
            await model.sub_task.update({ ...data, updated_at: new Date() },
                { where: { todoId: condition.where.id } }).catch((error) => {
                    throw new InternalSequelizeError(this._entityname, this.updateTodo.name, error);
                });
        return result;
    }

    async findAllTodoJoinSubTask(filter = {}) {
        const model = await models;

        await model.todo.hasMany(model.sub_task, { foreignKey: 'todo_id' });
        await model.sub_task.belongsTo(model.todo)

        let result = await model.todo
            .findAll({
                ...filter,
                include: { model: model.sub_task }
            })
            .catch((error) => {
                throw new InternalSequelizeError(this._entityname, this.findAllTodoJoinSubTask.name, error);
            });

        result = JSON.parse(JSON.stringify(result));
        result.map((e) => {
            delete e.updated_at
            e.subtasks = e.sub_tasks
            e.sub_tasks.map(st => {
                delete st.updated_at
                delete st.todoId
            })
            delete e.sub_tasks
        })
        return result;
    }
}

module.exports = TodoRepository;