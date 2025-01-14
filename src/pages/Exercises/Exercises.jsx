import React, { useState, useEffect } from 'react';
import { FaCalendar, FaCheckCircle } from 'react-icons/fa';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { format, parse } from 'date-fns';
import BasicLayout from '../../components/BasicLayout/BasicLayout';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import 'react-datepicker/dist/react-datepicker.css';
import './Exercises.css';

registerLocale('pt-BR', ptBR);

const Exercises = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState(null);
  const [training, setTraining] = useState(null);
  const [exercises, setExercises] = useState([]);
  const { user } = useUser();
  const { db } = useFirebase();

  // Buscar treino e exercícios
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        // Formata a data como dd/mm/yyyy para exibição
        const displayDate = format(selectedDate, 'dd/MM/yyyy');
        console.log('Buscando treino para a data:', displayDate);

        // Formata a data como yyyy-MM-dd para busca no Firebase
        const searchDate = format(selectedDate, 'yyyy-MM-dd');
        console.log('Data formatada para busca:', searchDate);

        // Busca todos os treinos ativos para a data
        const trainingQuery = query(
          collection(db, 'trainings'), // Correção do nome da coleção
          where('date', '==', searchDate)
        );

        const querySnapshot = await getDocs(trainingQuery);
        console.log('Resultados encontrados:', querySnapshot.size);

        if (!querySnapshot.empty) {
          const trainingDoc = querySnapshot.docs[0];
          const trainingData = trainingDoc.data();
          console.log('Dados do treino:', trainingData);

          setTraining({
            id: trainingDoc.id,
            ...trainingData,
            exercises: trainingData.exercises.map(ex => ({
              ...ex,
              isCompleted: false
            }))
          });
          setExercises(trainingData.exercises.map(ex => ({
            ...ex,
            isCompleted: false
          })));
        } else {
          console.log('Nenhum treino encontrado para a data');
          setTraining(null);
          setExercises([]);
        }
      } catch (error) {
        console.error("Erro ao buscar treino:", error);
        setTraining(null);
        setExercises([]);
      }
    };

    fetchTraining();
  }, [db, selectedDate]);

  // Verificar se o treino foi completado
  useEffect(() => {
    const checkCompletedTraining = async () => {
      if (!user?.uid || !training) return;

      const searchDate = format(selectedDate, 'yyyy-MM-dd');
      
      try {
        const q = query(
          collection(db, 'completedTrainings'),
          where('userId', '==', user.uid),
          where('date', '==', searchDate)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const completedTraining = querySnapshot.docs[0].data();
          setIsTrainingCompleted(true);
          setCompletedAt(completedTraining.completedAt?.toDate());
          
          // Marca os exercícios como completados
          setExercises(prev => prev.map(ex => ({ ...ex, isCompleted: true })));
        } else {
          setIsTrainingCompleted(false);
          setCompletedAt(null);
          // Reset exercícios para não completados
          setExercises(prev => prev.map(ex => ({ ...ex, isCompleted: false })));
        }
      } catch (error) {
        console.error("Erro ao verificar treino completado:", error);
      }
    };

    checkCompletedTraining();
  }, [user, selectedDate, db, training]);

  const handleComplete = (exerciseName) => {
    if (isTrainingCompleted) return;
    
    setExercises(exercises.map(exercise => 
      exercise.name === exerciseName
        ? { ...exercise, isCompleted: !exercise.isCompleted }
        : exercise
    ));
  };

  const formatCompletedDate = (date) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const handleFinishWorkout = async () => {
    if (!user?.uid || !training) {
      alert('Você precisa estar logado para salvar o treino.');
      return;
    }

    try {
      const searchDate = format(selectedDate, 'yyyy-MM-dd');
      const now = new Date();
      
      // Busca dados do usuário
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Busca dados completos do treino
      const trainingRef = doc(db, 'trainings', training.id);
      const trainingSnap = await getDoc(trainingRef);
      const trainingData = trainingSnap.data();
      
      // Calcula a distância total considerando as séries
      let totalDistance = 0;
      trainingData.exercises.forEach(exercise => {
        const distance = parseInt(exercise.distance) || 0;
        const series = parseInt(exercise.series) || 1;
        totalDistance += distance * series;
      });

      // Calcula novos pontos e distância
      const newPoints = (userData.points || 0) + 5;
      const trainingDuration = parseInt(trainingData?.duration) || 0;
      const newDistance = (userData.distance || 0) + totalDistance;
      
      // Atualiza documento do usuário
      await updateDoc(userRef, {
        points: newPoints,
        distance: newDistance,
        totalTrainingTime: (userData.totalTrainingTime || 0) + trainingDuration
      });

      // Prepara dados do treino completado
      const completionData = {
        userId: user.uid,
        date: searchDate,
        completedAt: now,
        exercises: exercises.map(ex => ({
          name: ex.name,
          isCompleted: ex.isCompleted
        })),
        trainingId: training.id,
        distance: totalDistance,
        duration: trainingDuration,
        name: trainingData.name,
        objective: trainingData.objective,
        level: trainingData.level
      };

      // Salva o treino completado
      await addDoc(collection(db, 'completedTrainings'), completionData);
      
      setIsTrainingCompleted(true);
      setCompletedAt(now);
      alert(`Treino finalizado com sucesso! Você ganhou 5 pontos e percorreu ${totalDistance}m em ${trainingDuration} minutos!`);
    } catch (error) {
      console.error('Error completing training:', error);
      alert('Erro ao finalizar treino. Tente novamente.');
    }
  };

  if (!training) {
    return (
      <BasicLayout>
        <div className="workout-page">
          <div className="workout-header">
            <h1>Treino de Natação</h1>
            <p className="workout-subtitle">Acompanhe os exercícios do seu treino</p>
          </div>

          <div className="date-selector">
            <h2>Selecione a Data</h2>
            <div className="date-input">
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                className="date-picker-input"
                customInput={
                  <div className="custom-input">
                    <input
                      type="text"
                      value={format(selectedDate, 'dd/MM/yyyy')}
                      readOnly
                    />
                    <FaCalendar className="calendar-icon" />
                  </div>
                }
              />
            </div>
          </div>

          <div className="no-training-message">
            Nenhum treino encontrado para {format(selectedDate, 'dd/MM/yyyy')}.
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="workout-page">
        <div className="workout-header">
          <h1>Treino de Natação</h1>
          <p className="workout-subtitle">Acompanhe os exercícios do seu treino</p>
        </div>

        <div className="date-selector">
          <h2>Selecione a Data</h2>
          <div className="date-input">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="date-picker-input"
              customInput={
                <div className="custom-input">
                  <input
                    type="text"
                    value={format(selectedDate, 'dd/MM/yyyy')}
                    readOnly
                  />
                  <FaCalendar className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>

        <div className="workout-info">
          <div className="workout-info-content">
            <div className="workout-title">
              <h2>{training.name}</h2>
              <div className="workout-type">{training.objective}</div>
              {isTrainingCompleted && (
                <div className="completed-badge">
                  <FaCheckCircle />
                  <span>Concluído em {formatCompletedDate(completedAt)}</span>
                </div>
              )}
            </div>
            <div className="workout-meta">
              <span>{training.level}</span>
              <span>•</span>
              <span>{training.duration} min</span>
              <span>•</span>
              <span>{exercises.length} exercício{exercises.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="exercises-list">
          {exercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <div className="exercise-header">
                <div className="exercise-number">#{index + 1}</div>
                <h3>{exercise.name}</h3>
                <div className="exercise-meta">
                  {exercise.series && <span>{exercise.series} séries</span>}
                  {exercise.distance && <span>{exercise.distance}m</span>}
                </div>
                <input 
                  type="checkbox"
                  checked={exercise.isCompleted}
                  onChange={() => handleComplete(exercise.name)}
                  disabled={isTrainingCompleted}
                />
              </div>
              <div className="exercise-details">
                <div className="detail-row">
                  {exercise.description && (
                    <span className="detail-value">{exercise.description}</span>
                  )}
                  {exercise.material && (
                    <span className="material-tag">{exercise.material}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isTrainingCompleted && (
          <button 
            className="finish-workout-button"
            onClick={handleFinishWorkout}
          >
            Finalizar Treino
          </button>
        )}
      </div>
    </BasicLayout>
  );
};

export default Exercises;
