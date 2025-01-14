import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../hooks/useUser';

const GuestGuard = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
