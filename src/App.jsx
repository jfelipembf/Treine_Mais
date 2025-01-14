import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Achievements from './pages/Achievements/Achievements';
import Exercises from './pages/Exercises/Exercises';
import Progress from './pages/Progress/Progress';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <FirebaseProvider>
        <AuthProvider>
          <UserProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/achievements" element={
                <PrivateRoute>
                  <Achievements />
                </PrivateRoute>
              } />
              
              <Route path="/exercises" element={
                <PrivateRoute>
                  <Exercises />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/progress" element={
                <PrivateRoute>
                  <Progress />
                </PrivateRoute>
              } />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  );
};

export default App;
