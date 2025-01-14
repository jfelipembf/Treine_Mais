import React from 'react';
import './AchievementCard.css';

const AchievementCard = ({ icon, title, description, progress, total, nextLevel, type = "BRONZE" }) => {
  return (
    <div className="achievement-card">
      <div className="achievement-header">
        <div className="achievement-icon">{icon}</div>
        <div className="achievement-type">{type}</div>
      </div>
      <h3 className="achievement-title">{title}</h3>
      <p className="achievement-description">{description}</p>
      <div className="achievement-progress">
        <div className="progress-text">
          <span>{progress} / {total}</span>
          <span>Próximo: {nextLevel}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(progress / total) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
