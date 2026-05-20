import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import AppNavigation from '../components/AppNavigation';
import {
  changePassword,
  fetchUserProfile,
  selectAuthError,
  selectAuthStatus,
  selectAuthUser
} from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const apiError = useAppSelector(selectAuthError);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const handleOldPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setOldPassword(event.target.value);
    setOldPasswordError('');
    setSuccessMessage('');
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(event.target.value);
    setNewPasswordError('');
    setSuccessMessage('');
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError('');
    setSuccessMessage('');
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!oldPassword) {
      setOldPasswordError('Введите старый пароль');
      isValid = false;
    }

    if (newPassword.length < 6) {
      setNewPasswordError('Новый пароль должен быть не короче 6 символов');
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Пароли должны совпадать');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        changePassword({
          oldPassword,
          newPassword
        })
      ).unwrap();

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Пароль успешно изменён');
    } catch {
      return;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <AppNavigation />

        <Paper elevation={0} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={700}>
              Профиль
            </Typography>

            {apiError && <Alert severity="error">{apiError}</Alert>}

            <Typography>Email: {user?.email || 'Загрузка...'}</Typography>
            <Typography>Age: {user?.age || 'Не указан'}</Typography>
            <Typography>
              Дата регистрации:{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Не указана'}
            </Typography>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 4 }}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <Typography variant="h5" fontWeight={700}>
              Смена пароля
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextField
              label="Старый пароль"
              type="password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              error={Boolean(oldPasswordError)}
              helperText={oldPasswordError}
              fullWidth
            />

            <TextField
              label="Новый пароль"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={Boolean(newPasswordError)}
              helperText={newPasswordError}
              fullWidth
            />

            <TextField
              label="Подтверждение нового пароля"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
              fullWidth
            />

            <Button type="submit" variant="contained" disabled={status === 'loading'}>
              Сменить пароль
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
