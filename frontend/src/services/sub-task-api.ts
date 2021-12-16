import { ITodo } from '.';
import ExcuteApi from './api-integrations/excute-api';

const SUB_TASK_PATH = `/api/v1/todo/subtask`

class SubTaskApi {
    createSubTask = async (params: PostSubTask): Promise<any> => {
        return ExcuteApi(SUB_TASK_PATH, params, 'post', null, null);
    };

    updateSubTask = async (id: number, data: PatchSubTask): Promise<any> => {
        return ExcuteApi(`${SUB_TASK_PATH}/${id}`, data, 'patch', null, null);
    };
}

export default new SubTaskApi();

export interface PostSubTask { title: string, todoId: number }
export interface PatchSubTask {
    updateBody: {
        status: "PENDING" | "COMPLETED"
    }
    currentTodoStatus: "PENDING" | "COMPLETED"
    todoId: number
    subtasks: {
        "id": number
        "title": string
        "status": "PENDING" | "COMPLETED"
        "created_at": Date
        "todo_id": number
        "key": number
    }[]
}