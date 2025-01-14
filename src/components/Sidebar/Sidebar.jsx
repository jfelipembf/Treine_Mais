import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTrophy, FaSwimmer, FaChartLine, FaSignOutAlt, FaUser, FaTimes } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FaHome, text: 'Dashboard' },
    { path: '/achievements', icon: FaTrophy, text: 'Conquistas' },
    { path: '/progress', icon: FaChartLine, text: 'Progresso' },
    { path: '/exercises', icon: FaSwimmer, text: 'Exercícios' },
    { path: '/profile', icon: FaUser, text: 'Perfil' },
  ];

  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="user-avatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" />
          ) : (
            <FaUser className="avatar-icon" />
          )}
        </div>
        <div className="user-info">
          <h3 className="user-name">{user?.displayName || 'Usuário'}</h3>
          
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={handleItemClick}
          >
            <item.icon />
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
