import type { Todo } from '../types/todo';

const TODOS_KEY = 'todo-app-todos';
const THEME_KEY = 'todo-app-theme';

interface StoredTodo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const saveTodosToStorage = (todos: Todo[]): void => {
  const preparedTodos: StoredTodo[] = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString()
  }));

  localStorage.setItem(TODOS_KEY, JSON.stringify(preparedTodos));
};

export const getTodosFromStorage = (): Todo[] => {
  const storedTodos = localStorage.getItem(TODOS_KEY);

  if (!storedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(storedTodos) as StoredTodo[];

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt)
    }));
  } catch {
    return [];
  }
};

export const saveThemeToStorage = (mode: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, mode);
};

export const getThemeFromStorage = (): 'light' | 'dark' => {
  const storedTheme = localStorage.getItem(THEME_KEY);

  return storedTheme === 'dark' ? 'dark' : 'light';
};
