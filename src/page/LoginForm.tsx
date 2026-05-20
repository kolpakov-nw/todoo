import {useState, type ChangeEvent, type FormEvent} from 'react';
import {Alert, Button, Container, Paper, Stack, TextField, Typography} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {fetchUserProfile, loginUser, selectAuthError, selectAuthStatus} from '../store/authSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const status = useAppSelector(selectAuthStatus);
    const apiError = useAppSelector(selectAuthError);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
        setEmailError('');
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
        setPasswordError('');
    };

    const validateForm = (): boolean => {
        let isValid = true;

        if (!emailRegExp.test(email)) {
            setEmailError('Введите корректный email');
            isValid = false;
        }

        if (password.length < 6) {
            setPasswordError('Пароль должен быть не короче 6 символов');
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
            await dispatch(loginUser({email, password})).unwrap();
            await dispatch(fetchUserProfile()).unwrap();
            navigate('/');
        } catch {
            return;
        }
    };

    return (
        <Container maxWidth="xs" sx={{py: 8}}>
            <Paper elevation={0} sx={{p: 4}}>
                <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                    <Typography variant="h4" fontWeight={700}>
                        Вход
                    </Typography>

                    {apiError && <Alert severity="error">{apiError}</Alert>}

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        error={Boolean(emailError)}
                        helperText={emailError}
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        fullWidth
                    />

                    <Button type="submit" variant="contained" disabled={status === 'loading'}>
                        Войти
                    </Button>

                    <Button component={Link} to="/register">
                        Зарегистрироваться
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default LoginForm;
