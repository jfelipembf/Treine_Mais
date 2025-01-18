import React, { useState, useContext } from 'react';
import { FaTrophy, FaUsers } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BasicLayout from '../../components/BasicLayout/BasicLayout';
import UserContext from '../../contexts/UserContext';
import './MyCompetitions.css';

const MyCompetitions = () => {
  const { user: userData } = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dados mockados para exemplo
  const competitions = [
    {
      id: 1,
      title: 'Campeonato Regional de Natação',
      date: '2024-12-10',
      location: 'São Paulo, SP',
      participants: 45,
      position: 2,
      category: '100m livre'
    },
    {
      id: 2,
      title: 'Copa Verão de Natação',
      date: '2024-11-15',
      location: 'Rio de Janeiro, RJ',
      participants: 32,
      position: 1,
      category: '50m borboleta'
    },
    {
      id: 3,
      title: 'Torneio Municipal',
      date: '2024-10-20',
      location: 'Belo Horizonte, MG',
      participants: 28,
      position: 3,
      category: '200m medley'
    },
    {
      id: 4,
      title: 'Circuito Nacional de Natação',
      date: '2024-09-05',
      location: 'Curitiba, PR',
      participants: 64,
      position: null,
      category: '400m livre'
    },
    {
      id: 5,
      title: 'Troféu Brasil de Natação',
      date: '2024-08-15',
      location: 'Brasília, DF',
      participants: 85,
      position: 4,
      category: '200m costas'
    }
  ];

  const getPositionColor = (position) => {
    switch(position) {
      case 1: return '#FFA500';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#6B7280';
    }
  };

  const getPositionText = (position) => {
    return position ? `${position}º lugar` : 'Participou';
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="date-input-container" onClick={onClick} ref={ref}>
      <div className="date-display">
        {value || 'Selecione uma data'}
      </div>
    </div>
  ));

  return (
    <BasicLayout>
      <div className="competitions-container">
        <div className="competitions-header">
          <h1>Minhas Competições</h1>
          <div className="calendar-section">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              customInput={<CustomInput />}
              dateFormat="dd/MM/yyyy"
              className="custom-datepicker"
            />
          </div>
        </div>

        <div className="competitions-list">
          {competitions.map(competition => (
            <div key={competition.id} className="competition-card">
              <div className="competition-header">
                <h3>{competition.title}</h3>
                <span 
                  className="position-badge"
                  style={{ 
                    backgroundColor: competition.position ? getPositionColor(competition.position) : '#6B7280',
                    opacity: competition.position ? 1 : 0.7
                  }}
                >
                  {getPositionText(competition.position)}
                </span>
              </div>
              <div className="competition-info">
                <p>
                  <strong>Data:</strong> {new Date(competition.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Local:</strong> {competition.location}
                </p>
                <p>
                  <strong>Categoria:</strong> {competition.category}
                </p>
                <p className="competition-participants">
                  <FaUsers /> {competition.participants} participantes
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BasicLayout>
  );
};

export default MyCompetitions;
