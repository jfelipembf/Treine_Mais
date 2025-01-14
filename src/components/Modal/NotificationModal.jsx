import React from 'react';
import { FaBell, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './NotificationModal.css';

const NotificationModal = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={20} />;
      case 'info':
      default:
        return <FaInfoCircle size={20} />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="notification-modal">
        <div className="modal-header">
          <div className="header-title">
            <FaBell size={20} color="#4a90e2" />
            <h2>Notificações</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar">
          </button>
        </div>
        <div className="notification-list">
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              {!notification.read && <div className="unread-indicator" />}
              <div className="notification-content">
                <div className="notification-icon">
                  {getIcon(notification.type)}
                </div>
                <div className="notification-text">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="no-notifications">
              Nenhuma notificação no momento
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
