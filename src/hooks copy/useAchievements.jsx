import { useContext } from 'react';
import { FirebaseContext } from '../../context/FirebaseContext';

export const useAchievements = () => {
  const {
    addAchievement,
    updateAchievement,
    completeAchievement,
    listAchievements
  } = useContext(FirebaseContext);

  return {
    addAchievement,
    updateAchievement,
    completeAchievement,
    listAchievements
  };
};
