import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from './Spinner';

/**
 * Restricts access to users whose role is included in `roles`.
 * Usage: <Route element={<RoleRoute roles={['lab_owner']} />}> ... </Route>
 */
const RoleRoute = ({ roles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
