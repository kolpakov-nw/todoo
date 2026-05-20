import apiClient from './apiClient';
import type {
    CreateTodoDto,
    Todo,
    TodosResponse,
    UpdateTodoDto
} from '../types/todo';

interface FlatTodosResponse {
    data: Todo[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export const fetchTodos = async (
    page: number,
    limit: number
): Promise<TodosResponse> => {
    const response = await apiClient.get<TodosResponse | FlatTodosResponse>('/todos', {
        params: { page, limit }
    });

    if ('pagination' in response.data) {
        return response.data;
    }

    return {
        data: response.data.data,
        pagination: {
            total: response.data.total ?? response.data.data.length,
            page: response.data.page ?? page,
            limit: response.data.limit ?? limit,
            totalPages:
                response.data.totalPages ??
                Math.max(1, Math.ceil((response.data.total ?? response.data.data.length) / limit))
        }
    };
};

export const createTodo = async (todoData: CreateTodoDto): Promise<Todo> => {
    const response = await apiClient.post<Todo>('/todos', todoData);

    return response.data;
};

export const deleteTodo = async (id: number): Promise<number> => {
    await apiClient.delete(`/todos/${id}`);

    return id;
};

export const updateTodo = async (
    id: number,
    todoData: UpdateTodoDto
): Promise<Todo> => {
    const response = await apiClient.put<Todo>(`/todos/${id}`, todoData);

    return response.data;
};

export const updateTodoStatus = async (id: number): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/todos/${id}/toggle`);

    return response.data;
};
