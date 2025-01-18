import React from 'react';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSwimmer, FaChartLine, FaSignOutAlt, FaUser, FaTimes, FaTrophy } from 'react-icons/fa';
import './Sidebar.css';
import UserContext from '../../contexts/UserContext';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const { user: userData } = useContext(UserContext);

  const menuItems = [
    { path: '/dashboard', icon: FaHome, text: 'Dashboard' },
    { path: '/progress', icon: FaChartLine, text: 'Progresso' },
    { path: '/exercises', icon: FaSwimmer, text: 'Exercícios' },
    { path: '/my-competitions', icon: FaTrophy, text: 'My Competitions' },
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
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" />
          ) : (
            <FaUser className="avatar-icon" />
          )}
        </div>
        <div className="user-info">
          <h3 className="user-name">{userData?.displayName || 'Usuário'}</h3>
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
        <button className="logout-button" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
