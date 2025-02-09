import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './BasicLayout.css';

const BasicLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fecha o menu quando mudar de rota em mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Ajusta o estado do sidebar quando a tela é redimensionada
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={`basic-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onLogout={handleLogout}
      />
      <div className="main-content">
        <Header 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          onLogout={handleLogout}
        />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BasicLayout;
