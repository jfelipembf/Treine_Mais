import React from 'react';
import './LevelCard.css';

const LevelCard = ({ level, points, pointsToNextLevel }) => {
  const progress = (points / (points + pointsToNextLevel)) * 100;
  
  return (
    <div className="level-card">
      <div className="level-circle">
        <svg viewBox="0 0 36 36" className="level-progress">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#4a90e2"
            strokeWidth="3"
            strokeDasharray={`${progress}, 100`}
          />
        </svg>
        <div className="level-icon">🏅</div>
      </div>
      
      <h2 className="level-title">Nível {level}</h2>
      <p className="level-points">{points} PONTOS</p>
      
      <div className="level-progress-info">
        <p>Faltam {pointsToNextLevel} pontos para o próximo nível</p>
        <div className="level-progress-bar">
          <div 
            className="level-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;
