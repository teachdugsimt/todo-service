import ExcuteApi from './api-integrations/excute-api';

const TODO_PATH = `/api/v1/todo`

class TodoApi {
    getTodoList = async (filter?: any): Promise<any> => {
        const defaultFilter = filter || { filter: { order: [['created_at', 'DESC']] } }
        return ExcuteApi(TODO_PATH, defaultFilter, 'get', null, null);
    };

    createTodo = async (params: PostTodo): Promise<any> => {
        return ExcuteApi(TODO_PATH, params, 'post', null, null);
    };

    updateTodo = async (id: number, data: PatchTodo): Promise<any> => {
        return ExcuteApi(`${TODO_PATH}/${id}`, data, 'patch', null, null);
    };
}

export default new TodoApi();

export interface PostTodo { title: string }
export interface PatchTodo { status: "PENDING" | "COMPLETED" }

export interface ISubTask {
    "id": number
    "title": string
    "status": "PENDING" | "COMPLETED"
    "created_at": Date
    "todo_id": number
    "key": number
}

export interface ITodo {
    "id": number
    "key": number
    "title": string
    "status": "PENDING" | "COMPLETED"
    "created_at": Date
    "subtasks": ISubTask[] | []
    "children": ISubTask[] | []
}
