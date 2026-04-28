import axios from 'axios';
import type {
    CreateTodoDto,
    Todo,
    TodoFilter,
    TodosApiResponse,
    UpdateTodoDto,
    UpdateTodoStatusDto
} from '../types/todo';

const API_URL = 'https://todo-backend-three-beryl.vercel.app';

type RawTodosResponse =
    | Todo[]
    | TodosApiResponse
    | {
    data?: Todo[];
    items?: Todo[];
    tasks?: Todo[];
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
};

const getFilterParams = (filter: TodoFilter): Record<string, string | boolean> => {
    if (filter === 'completed') {
        return { filter, completed: true };
    }

    if (filter === 'active') {
        return { filter, completed: false };
    }

    return { filter };
};

const getTodosArray = (data: RawTodosResponse): Todo[] => {
    if (Array.isArray(data)) {
        return data;
    }

    if ('todos' in data && Array.isArray(data.todos)) {
        return data.todos;
    }

    if ('data' in data && Array.isArray(data.data)) {
        return data.data;
    }

    if ('items' in data && Array.isArray(data.items)) {
        return data.items;
    }

    if ('tasks' in data && Array.isArray(data.tasks)) {
        return data.tasks;
    }

    return [];
};

const getTotal = (
    data: RawTodosResponse,
    todos: Todo[],
    totalFromHeaders?: string
): number => {
    if (totalFromHeaders) {
        return Number(totalFromHeaders);
    }

    if (!Array.isArray(data)) {
        if (typeof data.total === 'number') {
            return data.total;
        }

        if (typeof data.count === 'number') {
            return data.count;
        }
    }

    return todos.length;
};

const normalizeTodosResponse = (
    data: RawTodosResponse,
    page: number,
    limit: number,
    totalFromHeaders?: string
): TodosApiResponse => {
    const todos = getTodosArray(data);
    const total = getTotal(data, todos, totalFromHeaders);

    if (!Array.isArray(data)) {
        return {
            todos,
            total,
            page: typeof data.page === 'number' ? data.page : page,
            limit: typeof data.limit === 'number' ? data.limit : limit,
            totalPages:
                typeof data.totalPages === 'number'
                    ? Math.max(1, data.totalPages)
                    : Math.max(1, Math.ceil(total / limit))
        };
    }

    return {
        todos,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit))
    };
};

export const fetchTodos = async (
    page: number,
    limit: number,
    filter: TodoFilter
): Promise<TodosApiResponse> => {
    const response = await axios.get<RawTodosResponse>(`${API_URL}/todos`, {
        params: {
            page,
            limit,
            ...getFilterParams(filter)
        }
    });

    return normalizeTodosResponse(
        response.data,
        page,
        limit,
        response.headers['x-total-count']
    );
};

export const createTodo = async (todoData: CreateTodoDto): Promise<Todo> => {
    const response = await axios.post<Todo>(`${API_URL}/todos`, {
        ...todoData,
        completed: false,
        createdAt: new Date().toISOString()
    });

    return response.data;
};

export const deleteTodo = async (id: number): Promise<number> => {
    await axios.delete(`${API_URL}/todos/${id}`);

    return id;
};

export const updateTodo = async (
    id: number,
    todoData: UpdateTodoDto
): Promise<Todo> => {
    const response = await axios.put<Todo>(`${API_URL}/todos/${id}`, {
        text: todoData.text

    });

    return response.data;
};

export const updateTodoStatus = async (
    id: number,
    statusData: UpdateTodoStatusDto
): Promise<Todo> => {
    const response = await axios.patch<Todo>(`${API_URL}/todos/${id}/toggle`, statusData);

    return response.data;
};
