import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/images/logo.png';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (error) {
      console.error('Error during password reset:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <img src={logo} alt="Logo" className="auth-logo" />
          <h2>Recuperar Senha</h2>
          <p>Digite seu email para receber o link de recuperação</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {resetSent && (
            <div className="success-message">
              Email de recuperação enviado! Verifique sua caixa de entrada.
            </div>
          )}
          
          <button 
            type="submit"
            className="auth-button"
            disabled={loading || resetSent}
          >
            {loading ? 'Enviando...' : resetSent ? 'Email Enviado' : 'Enviar Link'}
          </button>
        </form>

        <div className="register-prompt">
          <p>
            Lembrou sua senha? <Link to="/login">Voltar ao login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
