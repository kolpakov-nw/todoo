import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
    createTodo,
    deleteTodo,
    fetchTodos,
    updateTodo,
    updateTodoStatus
} from '../api/todos';
import type {
    CreateTodoDto,
    Todo,
    TodoFilter,
    TodosResponse,
    UpdateTodoDto
} from '../types/todo';
import type { RootState } from './store';

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TodosState {
    items: Todo[];
    status: LoadingStatus;
    error: string | null;
    page: number;
    limit: number;
    filter: TodoFilter;
    total: number;
    totalPages: number;
}

interface FetchTodosParams {
    page: number;
    limit: number;
    filter: TodoFilter;
}

interface UpdateTodoParams {
    id: number;
    todoData: UpdateTodoDto;
}

interface UpdateTodoStatusParams {
    id: number;
}

const initialState: TodosState = {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    limit: 5,
    filter: 'all',
    total: 0,
    totalPages: 1
};

export const fetchTodosThunk = createAsyncThunk<
    TodosResponse,
    FetchTodosParams,
    { rejectValue: string }
>('todos/fetchTodos', async ({ page, limit }, { rejectWithValue }) => {
    try {
        return await fetchTodos(page, limit);
    } catch {
        return rejectWithValue('load error');
    }
});

export const createTodoThunk = createAsyncThunk<
    Todo,
    CreateTodoDto,
    { rejectValue: string }
>('todos/createTodo', async (todoData, { rejectWithValue }) => {
    try {
        return await createTodo(todoData);
    } catch {
        return rejectWithValue('create error');
    }
});

export const deleteTodoThunk = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>('todos/deleteTodo', async (id, { rejectWithValue }) => {
    try {
        return await deleteTodo(id);
    } catch {
        return rejectWithValue('dellite error');
    }
});

export const updateTodoThunk = createAsyncThunk<
    Todo,
    UpdateTodoParams,
    { rejectValue: string }
>('todos/updateTodo', async ({ id, todoData }, { rejectWithValue }) => {
    try {
        return await updateTodo(id, todoData);
    } catch {
        return rejectWithValue('Не удалось обновить задачу');
    }
});

export const updateTodoStatusThunk = createAsyncThunk<
    Todo,
    UpdateTodoStatusParams,
    { rejectValue: string }
>('todos/updateTodoStatus', async ({ id }, { rejectWithValue }) => {
    try {
        return await updateTodoStatus(id);
    } catch {
        return rejectWithValue('update status error');
    }
});

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setLimit(state, action: PayloadAction<number>) {
            state.limit = action.payload;
            state.page = 1;
        },
        setFilter(state, action: PayloadAction<TodoFilter>) {
            state.filter = action.payload;
            state.page = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodosThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTodosThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
                state.total = action.payload.pagination.total;
                state.page = action.payload.pagination.page;
                state.limit = action.payload.pagination.limit;
                state.totalPages = action.payload.pagination.totalPages || 1;
            })
            .addCase(fetchTodosThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'load error';
            })
            .addCase(createTodoThunk.rejected, (state, action) => {
                state.error = action.payload || 'creat error';
            })
            .addCase(deleteTodoThunk.rejected, (state, action) => {
                state.error = action.payload || 'delete error';
            })
            .addCase(updateTodoThunk.rejected, (state, action) => {
                state.error = action.payload || 'update error';
            })
            .addCase(updateTodoStatusThunk.rejected, (state, action) => {
                state.error = action.payload || 'update status error';
            });
    }
});

export const { setPage, setLimit, setFilter } = todosSlice.actions;

export const selectTodos = (state: RootState): Todo[] => state.todos.items;
export const selectTodosStatus = (state: RootState): LoadingStatus => state.todos.status;
export const selectTodosError = (state: RootState): string | null => state.todos.error;
export const selectTodosPage = (state: RootState): number => state.todos.page;
export const selectTodosLimit = (state: RootState): number => state.todos.limit;
export const selectTodosFilter = (state: RootState): TodoFilter => state.todos.filter;
export const selectTodosTotal = (state: RootState): number => state.todos.total;
export const selectTodosTotalPages = (state: RootState): number => state.todos.totalPages;

export default todosSlice.reducer;
