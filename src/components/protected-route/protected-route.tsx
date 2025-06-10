import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { getUserState } from '../../services/slices/useSlice/userSlice';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
};

export const ProtectedRoute = ({ onlyAuth: Auth }: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = useSelector(getUserState).isAuthenticationChecked;
  const isAuthenticated = useSelector(getUserState).isUserAuthenticated;

  if (!Auth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (Auth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (isAuthChecked) {
    return <Preloader />;
  }

  return <Outlet />;
};
