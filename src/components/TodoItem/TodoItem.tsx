import { Card, Checkbox, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';
import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

const StyledCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TodoText = styled(Typography)<{ $completed: boolean }>`
  word-break: break-word;
  text-decoration: ${({ $completed }) =>
    $completed ? 'line-through' : 'none'};
  opacity: ${({ $completed }) => ($completed ? 0.7 : 1)};
`;

const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onEdit
}: TodoItemProps)=> {
  const createdAtText = todo.createdAt.toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  return (
    <StyledCard>
      <LeftSection>
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          inputProps={{ 'aria-label': 'Отметить задачу выполненной' }}
        />

        <Content>
          <TodoText variant="h6" $completed={todo.completed}>
            {todo.text}
          </TodoText>

          <Typography variant="body2" color="text.secondary">
            Создано: {createdAtText}
          </Typography>

          <Typography
            variant="body2"
            color={todo.completed ? 'success.main' : 'warning.main'}
          >
            Статус: {todo.completed ? 'Готово' : 'Не готово'}
          </Typography>
        </Content>
      </LeftSection>

      <Actions>
        <IconButton
          aria-label="Редактировать задачу"
          onClick={() => onEdit(todo)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          aria-label="Удалить задачу"
          color="error"
          onClick={() => onDelete(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Actions>
    </StyledCard>
  );
};

export default TodoItem;
