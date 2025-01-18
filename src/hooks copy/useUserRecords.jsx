import { useContext } from 'react';
import { FirebaseContext } from '../../context/FirebaseContext';

export const useUserRecords = () => {
  const { addRecord, updateRecord, deleteRecord, listRecords } = useContext(FirebaseContext);

  return {
    addRecord,
    updateRecord,
    deleteRecord,
    listRecords
  };
};
