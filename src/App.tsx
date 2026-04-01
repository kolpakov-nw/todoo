import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Switch,
  Typography
} from '@mui/material';
import styled from 'styled-components';
import AddTodo from './components/AddTodo/AddTodo';
import EditTodo from './components/EditTodo/EditTodo';
import TodoList from './components/TodoList/TodoList';
import { useThemeContext } from './teme/Theme';
import type { Todo } from './types/todo';
import {
  getTodosFromStorage,
  saveTodosToStorage
} from './save/localStorage';

type SortOrder = 'newest' | 'oldest';
type FilterType = 'all' | 'completed' | 'active';

const Page = styled.div`
  height: 100vh;
  /*width: 100%;*/
  background: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 32px 0;
`;

const HeaderCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

    @media (max-width: 700px) {
      flex-direction: column;
      align-items: flex-start;
    }
`;

const ThemeSwitcher = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Controls = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;

      @media (max-width: 700px) {
        display: grid;
        grid-template-columns: 1fr;
      }
`;

const ContentCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const App = () => {
  const [todos, setTodos] = useState<Todo[]>(() => getTodosFromStorage());
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { mode, toggleTheme } = useThemeContext();

  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

  const handleAddTodo = (text: string): void => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const handleDeleteTodo = (id: number): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const handleOpenEdit = (todo: Todo): void => {
    setEditingTodo(todo);
  };

  const handleCloseEdit = (): void => {
    setEditingTodo(null);
  };

  const handleSaveEdit = (text: string): void => {
    if (!editingTodo) {
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === editingTodo.id ? { ...todo, text } : todo
      )
    );

    setEditingTodo(null);
  };

  const handleSortChange = (
    event: SelectChangeEvent<SortOrder>
  ): void => {
    setSortOrder(event.target.value as SortOrder);
  };

  const handleFilterChange = (
    event: SelectChangeEvent<FilterType>
  ): void => {
    setFilter(event.target.value as FilterType);
  };

  const visibleTodos = useMemo(() => {
    const filteredTodos = todos.filter((todo) => {
      if (filter === 'completed') {
        return todo.completed;
      }

      if (filter === 'active') {
        return !todo.completed;
      }

      return true;
    });

    return [...filteredTodos].sort((firstTodo, secondTodo) => {
      const firstDate = firstTodo.createdAt.getTime();
      const secondDate = secondTodo.createdAt.getTime();

      return sortOrder === 'newest'
        ? secondDate - firstDate
        : firstDate - secondDate;
    });
  }, [filter, sortOrder, todos]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <Page>
      <Container maxWidth="md">
        <HeaderCard elevation={0}>
          <HeaderTop>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                To do List
              </Typography>
            </div>

            <ThemeSwitcher>
              <Typography variant="body1">
                {mode === 'light' ? 'Дневной' : 'Ночной'}
              </Typography>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} />
            </ThemeSwitcher>
          </HeaderTop>

          <AddTodo onAddTodo={handleAddTodo} />

          <Controls>
            <FormControl fullWidth>
              <InputLabel id="sort-label">Сортировка</InputLabel>
              <Select<SortOrder>
                labelId="sort-label"
                value={sortOrder}
                label="Сортировка"
                onChange={handleSortChange}
              >
                <MenuItem value="newest">Сначало новые</MenuItem>
                <MenuItem value="oldest">Сначало старые</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="filter-label">Фильтр</InputLabel>
              <Select<FilterType>
                labelId="filter-label"
                value={filter}
                label="Фильтр"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="completed">Выполненые </MenuItem>
                <MenuItem value="active">Невыполненые</MenuItem>
              </Select>
            </FormControl>
          </Controls>
        </HeaderCard>

        <ContentCard elevation={0}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Всего задач: <strong>{todos.length}</strong> | Готовые:{' '}
            <strong>{completedCount}</strong> | Неготовые:{' '}
            <strong>{activeCount}</strong>
          </Typography>

          <TodoList
            todos={visibleTodos}
            onDeleteTodo={handleDeleteTodo}
            onToggleTodo={handleToggleTodo}
            onEditTodo={handleOpenEdit}
          />
        </ContentCard>

        <EditTodo
          open={Boolean(editingTodo)}
          initialText={editingTodo?.text ?? ''}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      </Container>
    </Page>
  );
};

export default App;
