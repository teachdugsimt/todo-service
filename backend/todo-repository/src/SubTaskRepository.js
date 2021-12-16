const InternalSequelizeError = require('./InternalSequelizeError');
var models = require('../models');

const STATUS_TODO = {
    "PENDING": "PENDING",
    "COMPLETED": "COMPLETED"
}

class SubTaskRepository {
    constructor() {
        this._entityname = SubTaskRepository.name;
    }

    async create(data) {
        const model = await models;
        const result = await model.sub_task.create(data).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.create.name, error);
        });
        await model.todo.update({ status: STATUS_TODO["PENDING"], updated_at: new Date() }, {
            where: { id: data.todoId }
        }).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.create.name, error);
        });
        return result;
    }

    async deleteSubTask(id) {
        const model = await models;
        const result = await model.sub_task.destroy({ where: { id: id } }).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.deleteSubTask.name, error);
        });
        return result;
    }

    async updateSubTask(data, condition) {
        const model = await models;
        const result = await model.sub_task.update({ ...data.updateBody, updated_at: new Date() }, condition).catch((error) => {
            throw new InternalSequelizeError(this._entityname, this.updateSubTask.name, error);
        });
        if (data.updateBody.status == STATUS_TODO["PENDING"] &&
            data.currentTodoStatus == STATUS_TODO["COMPLETED"]) {
            await model.todo.update({
                status: STATUS_TODO["PENDING"], updated_at: new Date()
            }, { where: { id: data.todoId } }).catch((error) => {
                throw new InternalSequelizeError(this._entityname, this.updateSubTask.name, error);
            });
        }

        if (data.updateBody.status == STATUS_TODO["COMPLETED"]) {
            const countPendingOfSubTasks = data.subtasks.filter(e => e.status == STATUS_TODO["PENDING"])
            if (countPendingOfSubTasks.length && countPendingOfSubTasks.length == 1 &&
                countPendingOfSubTasks[0].id == condition.where.id) {
                await model.todo.update({
                    status: STATUS_TODO["COMPLETED"], updated_at: new Date()
                }, { where: { id: data.todoId } }).catch((error) => {
                    throw new InternalSequelizeError(this._entityname, this.updateSubTask.name, error);
                });
            }
        }
        return result;
    }
}

module.exports = SubTaskRepository;