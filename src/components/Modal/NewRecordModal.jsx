import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './NewRecordModal.css';

const NewRecordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    eventType: '',
    time: '',
    distance: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventType">Prova</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma prova</option>
              <option value="100m">100m</option>
              <option value="200m">200m</option>
              <option value="400m">400m</option>
              <option value="800m">800m</option>
              <option value="1500m">1500m</option>
              <option value="5000m">5000m</option>
              <option value="10000m">10000m</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time">Tempo (mm:ss)</label>
            <input
              type="text"
              id="time"
              name="time"
              placeholder="00:00:00"
              pattern="[0-9]{2}:[0-9]{2}"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="distance">Distância (metros)</label>
            <input
              type="number"
              id="distance"
              name="distance"
              placeholder="0"
              min="1"
              value={formData.distance}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button className="save-button" onClick={handleSubmit}>
              Salvar Marca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRecordModal;
