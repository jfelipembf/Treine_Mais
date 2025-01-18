import { useContext } from 'react';
import { FirebaseContext } from '../../context/FirebaseContext';

export const useUserData = () => {
  const { addUser, updateUser, deleteUser } = useContext(FirebaseContext);

  return {
    addUser,
    updateUser,
    deleteUser
  };
};
