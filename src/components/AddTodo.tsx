import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, TextField } from '@mui/material';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createTodoThunk,
  fetchTodosThunk,
  selectTodosFilter,
  selectTodosLimit,
  selectTodosPage
} from '../store/todosSlice';

const Form = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  min-width: 140px;
  width: 140px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const AddTodo = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectTodosPage);
  const limit = useAppSelector(selectTodosLimit);
  const filter = useAppSelector(selectTodosFilter);

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError('Pusto');
      return;
    }

    try {
      await dispatch(createTodoThunk({ text: trimmedText })).unwrap();

      setText('');
      setError('');

      dispatch(fetchTodosThunk({ page, limit, filter }));
    } catch (error) {
      setError('error create');
      console.error('error create', error);
    }
  };

  return (
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <TextField
              fullWidth
              label="ввод задачи"
              variant="outlined"
              value={text}
              onChange={handleChange}
              error={Boolean(error)}
              helperText={error || ' '}
          />
        </InputWrapper>

        <ButtonWrapper>
          <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ height: '56px' }}
          >
            добавить
          </Button>
        </ButtonWrapper>
      </Form>
  );
};

export default AddTodo;
