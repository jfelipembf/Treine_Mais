import React from 'react';
import { FaSwimmer } from 'react-icons/fa';
import './SwimExerciseCard.css';

const SwimExerciseCard = ({ 
  number,
  title,
  series,
  distance,
  description,
  material,
  isCompleted,
  onComplete
}) => {
  return (
    <div className="swim-exercise-card">
      <div className="exercise-header">
        <div className="exercise-title-group">
          <div className="exercise-number">#{number}</div>
          <div className="exercise-title">
            <FaSwimmer className="swim-icon" />
            <h3>{title}</h3>
          </div>
        </div>
        
        <div className="exercise-metrics">
          <span className="metric">{series}x{distance}m</span>
        </div>

        <label className="checkbox-container">
          <input 
            type="checkbox"
            checked={isCompleted}
            onChange={onComplete}
          />
          <span className="checkmark"></span>
          <span className="checkbox-label">
            {isCompleted ? 'Concluído' : 'Marcar como concluído'}
          </span>
        </label>
      </div>

      <div className="exercise-content">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Descrição:</span>
            <span className="info-value">{description}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Material:</span>
            <span className="info-value">{material}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwimExerciseCard;
