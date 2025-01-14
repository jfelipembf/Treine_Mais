import React, { useState } from 'react';
import { FaCalendarAlt, FaSwimmer } from 'react-icons/fa';
import Button from '../../components/Button/Button';
import SwimExerciseCard from '../../components/Card/SwimExerciseCard';
import './Training.css';

const Training = () => {
  const [selectedDate, setSelectedDate] = useState('2025-01-14');
  const [completedExercises, setCompletedExercises] = useState(new Set());

  const trainingData = {
    level: 'iniciante',
    duration: '42 minutos',
    technique: 'Técnica de crawl',
    exercises: [
      {
        id: 1,
        title: 'Pernada',
        series: 3,
        distance: 300,
        description: 'Rápido no início',
        material: 'Prancha'
      },
      {
        id: 2,
        title: 'Braçada',
        series: 4,
        distance: 200,
        description: 'Foco na técnica',
        material: 'Pull buoy'
      },
      {
        id: 3,
        title: 'Respiração',
        series: 2,
        distance: 150,
        description: 'Respiração bilateral',
        material: 'Nenhum'
      }
    ]
  };

  const handleExerciseComplete = (exerciseId) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleFinishTraining = () => {
    if (completedExercises.size === trainingData.exercises.length) {
      alert('Parabéns! Você completou todos os exercícios do treino!');
    } else {
      alert('Você ainda tem exercícios pendentes.');
    }
  };

  return (
    <div className="training-page">
      <div className="training-header">
        <h1>Acompanhe os exercícios do seu treino</h1>
        
        <div className="date-selector">
          <label>Selecione a Data</label>
          <div className="date-input-wrapper">
            <FaCalendarAlt className="calendar-icon" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      <div className="training-info">
        <h2>
          <FaSwimmer />
          Inicial
        </h2>
        <div className="info-details">
          <div className="info-item">
            <span className="info-label">Nível:</span>
            <span className="info-value">{trainingData.level}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duração:</span>
            <span className="info-value">{trainingData.duration}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Técnica:</span>
            <span className="info-value">{trainingData.technique}</span>
          </div>
        </div>
      </div>

      <div className="exercises-list">
        {trainingData.exercises.map((exercise) => (
          <SwimExerciseCard
            key={exercise.id}
            number={exercise.id}
            title={exercise.title}
            series={exercise.series}
            distance={exercise.distance}
            description={exercise.description}
            material={exercise.material}
            isCompleted={completedExercises.has(exercise.id)}
            onComplete={() => handleExerciseComplete(exercise.id)}
          />
        ))}
      </div>

      <div className="training-actions">
        <Button
          variant="primary"
          onClick={handleFinishTraining}
          className="finish-button"
        >
          Finalizar Treino
        </Button>
      </div>
    </div>
  );
};

export default Training;
