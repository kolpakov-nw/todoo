import React, { useState, type ChangeEvent } from 'react';
import { Button, TextField } from '@mui/material';
import styled from 'styled-components';

interface AddTodoProps {
  onAddTodo: (text: string) => void;
}

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

const AddTodo = ({ onAddTodo }: AddTodoProps) => {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);

    if (error) {
      setError('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError('Pusto');
      return;
    }

    onAddTodo(trimmedText);
    setText('');
    setError('');
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
