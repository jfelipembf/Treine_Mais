import React, { useState, useEffect } from 'react';
import './NewRecordModal.css';

const NewRecordModal = ({ isOpen, onClose, onSubmit, competitions = [] }) => {
  if (!isOpen) return null;

  const [recordType, setRecordType] = useState('competition');
  const [formData, setFormData] = useState({
    competition: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    distance: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompetitionChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      competition: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, type: recordType });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-record-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <button className="close-button" onClick={onClose}></button>
          <div className="modal-header">
            <h2 className="modal-title">Adicionar Nova Marca</h2>
          </div>

          <form onSubmit={handleSubmit} className="record-form">
            <div className="record-type-selector">
              <div className={`record-type-buttons ${recordType === 'free' ? 'free-active' : ''}`}>
                <button
                  type="button"
                  className={`type-button ${recordType === 'competition' ? 'active' : ''}`}
                  onClick={() => setRecordType('competition')}
                >
                  Competição
                </button>
                <button
                  type="button"
                  className={`type-button ${recordType === 'free' ? 'active' : ''}`}
                  onClick={() => setRecordType('free')}
                >
                  Livre
                </button>
              </div>
            </div>

            {recordType === 'competition' && (
              <div className="form-group">
                <label htmlFor="competition">Competição</label>
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
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Tempo</label>
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="00:00:00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="distance">Distância (metros)</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                placeholder="Digite a distância"
              />
            </div>

            <div className="modal-footer">
              <button type="submit" className="modal-button submit-button">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRecordModal;
