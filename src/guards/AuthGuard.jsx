import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../hooks/useUser';

const AuthGuard = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
