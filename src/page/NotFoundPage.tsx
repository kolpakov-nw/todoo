import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={700}>
            Страница не найдена
          </Typography>
          <Button component={Link} to="/" variant="contained">
            На главную
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
