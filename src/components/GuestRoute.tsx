import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectAuthToken } from '../store/authSlice';

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = useAppSelector(selectAuthToken);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
