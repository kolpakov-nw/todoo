

// const TODOS_KEY = 'todo-app-todos';//

const THEME_KEY = 'todo-app-theme';

export const saveThemeToStorage = (mode: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, mode);
};

export const getThemeFromStorage = (): 'light' | 'dark' => {
  const storedTheme = localStorage.getItem(THEME_KEY);

  return storedTheme === 'dark' ? 'dark' : 'light';
};
