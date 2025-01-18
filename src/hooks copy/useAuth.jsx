import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { signIn, signOut, authError } = useContext(AuthContext);
  return { signIn, signOut, authError };
};
