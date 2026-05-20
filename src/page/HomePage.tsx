import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Alert,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import styled from 'styled-components';
import AddTodo from '../components/AddTodo';
import AppNavigation from '../components/AppNavigation';
import EditTodo from '../components/EditTodo';
import TodoList from '../components/TodoList';
import { useThemeContext } from '../teme/Theme';
import type { Todo, TodoFilter } from '../types/todo';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  deleteTodoThunk,
  fetchTodosThunk,
  selectTodos,
  selectTodosError,
  selectTodosFilter,
  selectTodosLimit,
  selectTodosPage,
  selectTodosStatus,
  selectTodosTotal,
  selectTodosTotalPages,
  setFilter,
  setLimit,
  setPage,
  updateTodoStatusThunk,
  updateTodoThunk
} from '../store/todosSlice';

type SortOrder = 'newest' | 'oldest';

const Page = styled.div`
  min-height: 100vh;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const ThemeSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { mode, toggleTheme } = useThemeContext();
  const todos = useAppSelector(selectTodos);
  const status = useAppSelector(selectTodosStatus);
  const error = useAppSelector(selectTodosError);
  const page = useAppSelector(selectTodosPage);
  const limit = useAppSelector(selectTodosLimit);
  const filter = useAppSelector(selectTodosFilter);
  const total = useAppSelector(selectTodosTotal);
  const totalPages = useAppSelector(selectTodosTotalPages);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    dispatch(fetchTodosThunk({ page, limit, filter }));
  }, [dispatch, page, limit, filter]);

  const reloadTodos = (): void => {
    dispatch(fetchTodosThunk({ page, limit, filter }));
  };

  const handleDeleteTodo = async (id: number): Promise<void> => {
    try {
      await dispatch(deleteTodoThunk(id)).unwrap();
      reloadTodos();
    } catch (error) {
      console.error('Ошибка удаления задачи', error);
    }
  };

  const handleToggleTodo = async (todo: Todo): Promise<void> => {
    try {
      await dispatch(
        updateTodoStatusThunk({
          id: todo.id
        })
      ).unwrap();

      reloadTodos();
    } catch (error) {
      console.error('Ошибка изменения статуса задачи', error);
    }
  };

  const handleOpenEdit = (todo: Todo): void => {
    setEditingTodo(todo);
  };

  const handleCloseEdit = (): void => {
    setEditingTodo(null);
  };

  const handleSaveEdit = async (text: string): Promise<void> => {
    if (!editingTodo) {
      return;
    }

    try {
      await dispatch(
        updateTodoThunk({
          id: editingTodo.id,
          todoData: {
            text,
            completed: editingTodo.completed
          }
        })
      ).unwrap();

      setEditingTodo(null);
      reloadTodos();
    } catch (error) {
      console.error('Ошибка обновления задачи', error);
    }
  };

  const handleSortChange = (event: SelectChangeEvent<SortOrder>): void => {
    setSortOrder(event.target.value as SortOrder);
  };

  const handleFilterChange = (event: SelectChangeEvent<TodoFilter>): void => {
    dispatch(setFilter(event.target.value as TodoFilter));
  };

  const handleLimitChange = (event: SelectChangeEvent<number>): void => {
    dispatch(setLimit(Number(event.target.value)));
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number): void => {
    dispatch(setPage(value));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') {
      return todo.completed;
    }

    if (filter === 'active') {
      return !todo.completed;
    }

    return true;
  });

  const sortedTodos = [...filteredTodos].sort((firstTodo, secondTodo) => {
    const firstDate = new Date(firstTodo.createdAt).getTime();
    const secondDate = new Date(secondTodo.createdAt).getTime();

    return sortOrder === 'newest'
      ? secondDate - firstDate
      : firstDate - secondDate;
  });

  return (
    <Page>
      <Container maxWidth="md">
        <HeaderCard elevation={0}>
          <HeaderTop>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                To do List
              </Typography>
              <AppNavigation />
            </div>

            <HeaderActions>
              <ThemeSwitcher>
                <Typography variant="body1">
                  {mode === 'light' ? 'Дневной' : 'Ночной'}
                </Typography>
                <Switch checked={mode === 'dark'} onChange={toggleTheme} />
              </ThemeSwitcher>
            </HeaderActions>
          </HeaderTop>

          <AddTodo />

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
              <Select<TodoFilter>
                labelId="filter-label"
                value={filter}
                label="Фильтр"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="completed">Выполненые</MenuItem>
                <MenuItem value="active">Невыполненые</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="limit-label">Количество</InputLabel>
              <Select<number>
                labelId="limit-label"
                value={limit}
                label="Количество"
                onChange={handleLimitChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>
          </Controls>
        </HeaderCard>

        <ContentCard elevation={0}>
          <Stack spacing={2}>
            <Typography variant="body1">
              Всего задач: <strong>{total}</strong> | Страница:{' '}
              <strong>{page}</strong> из <strong>{totalPages}</strong>
            </Typography>

            {status === 'loading' && (
              <Typography variant="body1">loade todo</Typography>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {status !== 'loading' && (
              <TodoList
                todos={sortedTodos}
                onDeleteTodo={handleDeleteTodo}
                onToggleTodo={handleToggleTodo}
                onEditTodo={handleOpenEdit}
              />
            )}

            {totalPages > 1 && (
              <PaginationWrapper>
                <Pagination
                  page={page}
                  count={totalPages}
                  color="primary"
                  onChange={handlePageChange}
                />
              </PaginationWrapper>
            )}
          </Stack>
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

export default HomePage;
