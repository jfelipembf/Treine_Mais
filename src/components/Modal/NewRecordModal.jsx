import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';
import { COLLECTIONS } from '../../constants/collections';
import './NewRecordModal.css';

const NewRecordModal = ({ isOpen, onClose, onNewRecord }) => {
  const { db } = useFirebase();
  const [competitions, setCompetitions] = useState([]);
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
        console.log('Competições disponíveis:', querySnapshot.docs.length);
        
        const comps = querySnapshot.docs.map(doc => {
          console.log('Competição:', doc.id, doc.data());
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        console.log('Lista de competições:', comps);
        setCompetitions(comps);
      } catch (error) {
        console.error('Erro ao buscar competições:', error);
      }
    };

    fetchCompetitions();
  }, [db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Mudança no formulário:', name, value);
    
    if (name === 'competition') {
      const selectedCompetition = competitions.find(comp => comp.id === value);
      console.log('Competição selecionada:', selectedCompetition);
      
      setFormData(prev => ({
        ...prev,
        competition: value,
        competitionName: selectedCompetition?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando dados:', formData);
    onNewRecord(formData);
    setFormData({
      date: '',
      competition: '',
      competitionName: '',
      time: '',
      distance: ''
    });
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
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="competition">Competição</label>
            <select
              id="competition"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
            >
              <option value="">Selecione uma competição</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time">Tempo (em minutos)</label>
            <input
              type="number"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="distance">Distância (em metros)</label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRecordModal;
