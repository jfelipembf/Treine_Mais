import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useUser = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser;
};
