import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';

interface EditTodoProps {
  open: boolean;
  initialText: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

const EditTodo = ({
  open,
  initialText,
  onSave,
  onClose
}: EditTodoProps) => {
  const [text, setText] = useState<string>(initialText);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setText(initialText);
    setError('');
  }, [initialText, open]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);

    if (error) {
      setError('');
    }
  };

  const handleSave = (): void => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError('Поле неможет быть пустым');
      return;
    }

    onSave(trimmedText);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Редактировать</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Текст задачи"
          value={text}
          onChange={handleChange}
          error={Boolean(error)}
          helperText={error || ' '}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodo;
