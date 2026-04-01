import { Typography } from '@mui/material';
import styled from 'styled-components';
import type { Todo } from '../../types/todo';
import TodoItem from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  onEditTodo: (todo: Todo) => void;
}

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px dashed ${({ theme }) => theme.palette.divider};
`;

const TodoList = ({
  todos,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo
}: TodoListProps)=> {
  if (todos.length === 0) {
    return (
      <EmptyState>
        <Typography variant="h6" gutterBottom>
          Nichego net
        </Typography>
      </EmptyState>
    );
  }

  return (
    <ListWrapper>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onToggle={onToggleTodo}
          onEdit={onEditTodo}
        />
      ))}
    </ListWrapper>
  );
};

export default TodoList;
