import { Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/authSlice';

const AppNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button component={Link} to="/" variant="outlined">
        Главная
      </Button>
      <Button component={Link} to="/profile" variant="outlined">
        Профиль
      </Button>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Выйти
      </Button>
    </Stack>
  );
};

export default AppNavigation;
