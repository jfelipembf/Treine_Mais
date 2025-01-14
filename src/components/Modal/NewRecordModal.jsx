import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useUser } from '../../contexts/UserContext';
import { COLLECTIONS } from '../../constants/collections';
import './NewRecordModal.css';

const NewRecordModal = ({ isOpen, onClose, onNewRecord }) => {
  const { db } = useFirebase();
  const { user } = useUser();
  const [competitions, setCompetitions] = useState([]);
  const [recordType, setRecordType] = useState('competition');
  const [formData, setFormData] = useState({
    date: '',
    competition: '',
    competitionName: '',
    time: '',
    distance: ''
  });

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const competitionsRef = collection(db, COLLECTIONS.BASIC_COMPETITION);
        const querySnapshot = await getDocs(competitionsRef);
        const comps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompetitions(comps);
      } catch (error) {
        console.error('Erro ao buscar competições:', error);
      }
    };

    fetchCompetitions();
  }, [db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'time') {
      // Allow direct input of time format
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCompetitionChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'competition') {
      const selectedCompetition = competitions.find(comp => comp.id === value);
      setFormData(prev => ({
        ...prev,
        competition: value,
        competitionName: selectedCompetition?.name || ''
      }));
    }
  };

  // Função para converter tempo de "HH:mm:ss" para segundos
  const convertTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      const timeInSeconds = convertTimeToSeconds(formData.time);
      
      const recordData = {
        type: recordType,
        date: formData.date,
        userId: user.uid,
        time: timeInSeconds,
        timeStr: formData.time, // Enviando também o tempo formatado
        distance: parseFloat(formData.distance) || 0
      };

      // Só adiciona campos de competição se for tipo competição
      if (recordType === 'competition') {
        if (!formData.competition) {
          alert('Por favor, selecione uma competição');
          return;
        }
        recordData.competition = formData.competition;
        recordData.competitionName = formData.competitionName;
      }

      onNewRecord(recordData);
      setFormData({
        date: '',
        competition: '',
        competitionName: '',
        time: '',
        distance: ''
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-record-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Nova Marca</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="record-form">
          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group record-type-selector">
            <label>Tipo de Marca</label>
            <div className="record-type-buttons">
              <button
                type="button"
                className={`type-button ${recordType === 'competition' ? 'active' : ''}`}
                onClick={() => {
                  console.log('Mudando para competição');
                  setRecordType('competition');
                  console.log('Tipo atual:', recordType);
                  console.log('Form data:', formData);
                }}
              >
                Competições
              </button>
              <button
                type="button"
                className={`type-button ${recordType === 'free' ? 'active' : ''}`}
                onClick={() => {
                  console.log('Mudando para marca livre');
                  setRecordType('free');
                  console.log('Tipo antes de limpar:', recordType);
                  setFormData(prev => {
                    console.log('Form data antes:', prev);
                    const newData = {
                      ...prev,
                      competition: '',
                      competitionName: ''
                    };
                    console.log('Form data depois:', newData);
                    return newData;
                  });
                  console.log('Tipo depois de limpar:', recordType);
                }}
              >
                Marca Livre
              </button>
            </div>
          </div>

          {recordType === 'competition' && (
            <div className="form-group">
              <label htmlFor="competition">Competição:</label>
              <select
                id="competition"
                name="competition"
                value={formData.competition}
                onChange={handleCompetitionChange}
              >
                <option value="">Selecione uma competição</option>
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="distance">Distância (metros):</label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleInputChange}
              placeholder="Digite a distância"
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Tempo:</label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="00:00:00"
            />
          </div>

          <button type="submit" className="submit-button">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRecordModal;
