import React from 'react';
import { FaMedal, FaUsers, FaStopwatch, FaRulerHorizontal, FaCalendarAlt } from 'react-icons/fa';
import './CompetitionCard.css';

const CompetitionCard = ({ competition }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="competition-card">
      <div className="position-badge">
        <FaMedal className="medal-icon" />
        <span>#{competition.position}</span>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="competition-title">{competition.name}</h3>
          <span className="date-info">
            <FaCalendarAlt className="icon" />
            {formatDate(competition.date)}
          </span>
        </div>
        <div className="competition-info">
          <span className="info-item">
            <FaUsers className="icon" />
            {competition.participants} participantes
          </span>
          <span className="info-item">
            <FaRulerHorizontal className="icon" />
            {competition.distance}m
          </span>
          <span className="info-item">
            <FaStopwatch className="icon" />
            {formatTime(competition.time)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
