import { useSelector } from 'react-redux';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';

export function useAuth() {
  const auth = useSelector((state) => state.auth);

  const signOut = async () => {
    const firebaseAuth = getAuth();
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    isAuthenticated: auth.isLoggedIn,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    signOut
  };
}
