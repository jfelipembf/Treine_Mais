import React from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';
import './Header.css';

const Header = ({ toggleSidebar, isSidebarOpen, onLogout }) => {
  return (
    <div className="header-container">
      <header className="header">
        <button 
          className="menu-button" 
          onClick={toggleSidebar} 
          aria-label="Menu"
        >
          <FaBars />
        </button>
        <div className="logo">
          Training System
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar}
        onLogout={onLogout}
      />

      {/* Overlay para mobile */}
      {window.innerWidth < 1024 && (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Header;
