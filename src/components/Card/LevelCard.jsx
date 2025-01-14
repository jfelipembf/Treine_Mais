import React, { useState } from 'react';
import './LevelCard.css';
import ShareMenu from '../ShareMenu/ShareMenu';
import { FaShare } from 'react-icons/fa';

const LevelCard = ({ level, points, pointsToNextLevel, achievements = [] }) => {
  const progress = (points / (points + pointsToNextLevel)) * 100;
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handleShare = (achievement) => {
    setSelectedAchievement(achievement);
    setIsShareMenuOpen(true);
  };

  return (
    <div className="level-card">
      <div className="level-circle">
        <div className="level-number">{level}</div>
        <div className="level-text">Nível</div>
      </div>
      <div className="level-progress">
        <div className="points-info">
          <div className="current-points">
            <span className="points-value">{points}</span>
            <span className="points-label">Pontos</span>
          </div>
          <div className="next-level">
            <span className="points-value">{pointsToNextLevel}</span>
            <span className="points-label">Para o próximo nível</span>
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="achievements-section">
          <h3>Conquistas Desbloqueadas</h3>
          <div className="achievements-list">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <span>{achievement.name}</span>
                <button 
                  className="share-button"
                  onClick={() => handleShare(achievement)}
                  title="Compartilhar conquista"
                >
                  <FaShare />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ShareMenu 
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        achievement={selectedAchievement}
      />
    </div>
  );
};

export default LevelCard;
