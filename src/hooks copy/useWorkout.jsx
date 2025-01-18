import { useContext } from 'react';
import { FirebaseContext } from '../../context/FirebaseContext';

export const useWorkout = () => {
  const {
    addWorkoutDay,
    updateWorkoutDay,
    deleteWorkoutDay,
    listWorkoutDays,
    addExerciseToWorkoutDay,
    updateExercise,
    deleteExercise,
    listExercises
  } = useContext(FirebaseContext);

  return {
    addWorkoutDay,
    updateWorkoutDay,
    deleteWorkoutDay,
    listWorkoutDays,
    addExerciseToWorkoutDay,
    updateExercise,
    deleteExercise,
    listExercises
  };
};
