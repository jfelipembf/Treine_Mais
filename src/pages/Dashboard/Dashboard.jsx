import React, { useState, useEffect, useContext } from 'react';
import { FaTrophy, FaBolt, FaRuler, FaBell, FaUser } from 'react-icons/fa';
import { doc, updateDoc, arrayUnion, collection, addDoc, setDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasicLayout from '../../components/BasicLayout/BasicLayout';
import NotificationModal from '../../components/Modal/NotificationModal';
import NewRecordModal from '../../components/Modal/NewRecordModal';
import { useAuth } from '../../contexts/AuthContext';
import UserContext from '../../contexts/UserContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import { COLLECTIONS } from '../../constants/collections';
import { calculateLevel, getLevelColor, calculateObjectiveProgress, objectives } from '../../utils/levelSystem';
import './Dashboard.css';

const Dashboard = () => {
  const { user: authUser } = useAuth();
  const { user: userData } = useContext(UserContext);
  const { db } = useFirebase();
  const [objectivesProgress, setObjectivesProgress] = useState({
    frequency: 0,
    distance: 0,
    time: 0
  });

  // Estado para modal de notificações
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Carrega notificações do usuário
  useEffect(() => {
    if (userData?.id) {
      // Aqui você pode implementar a lógica para carregar notificações do Firestore
      // Por enquanto vamos usar dados estáticos
      setNotifications([
        {
          id: 1,
          title: 'Nova conquista desbloqueada!',
          message: 'Parabéns! Você completou 10 treinos este mês.',
          time: '2 horas atrás',
          type: 'success',
          read: false
        }
      ]);
    }
  }, [userData?.id]);

  useEffect(() => {
    if (userData) {
      // Atualiza o contador de objetivos completados
      setObjectivesProgress({
        frequency: Math.floor((userData.frequence || 0) / objectives.frequency.baseTarget),
        distance: Math.floor((userData.distance || 0) / objectives.distance.baseTarget),
        time: Math.floor((userData.totalTrainingTime || 0) / objectives.time.baseTarget)
      });
    }
  }, [userData]);

  const hasNotifications = notifications.length > 0;
  const notificationCount = notifications.filter(notification => !notification.read).length;

  // Calcula progressos
  const frequencyProgress = calculateObjectiveProgress('frequency', userData?.frequence || 0);
  const distanceProgress = calculateObjectiveProgress('distance', userData?.distance || 0);
  const timeProgress = calculateObjectiveProgress('time', userData?.totalTrainingTime || 0);

  // Efeito para verificar e atualizar pontos quando houver progresso
  useEffect(() => {
    if (frequencyProgress) {
      // Aqui você pode implementar a lógica para atualizar pontos no Firestore
      // Por enquanto vamos apenas exibir uma mensagem
      console.log('Parabéns! Você completou um objetivo de frequência!');
    }
    if (distanceProgress) {
      // Aqui você pode implementar a lógica para atualizar pontos no Firestore
      // Por enquanto vamos apenas exibir uma mensagem
      console.log('Parabéns! Você completou um objetivo de distância!');
    }
    if (timeProgress) {
      // Aqui você pode implementar a lógica para atualizar pontos no Firestore
      // Por enquanto vamos apenas exibir uma mensagem
      console.log('Parabéns! Você completou um objetivo de tempo!');
    }
  }, [frequencyProgress, distanceProgress, timeProgress]);

  const AchievementCard = ({ title, progress, totalPoints, icon, description, fractionProgress }) => {
    return (
      <div className="achievement-card">
        <div className="achievement-title">
          <span className="achievement-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <div className="achievement-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{fractionProgress}</div>
        </div>
        <div className="achievement-points">
          <span className="total-points">+{totalPoints} pontos</span>
        </div>
        <p className="achievement-description">{description}</p>
      </div>
    );
  };

  const handleNewRecord = async (recordData) => {
    try {
      const { competition, competitionName, time, distance, date } = recordData;
      const userId = userData?.uid || authUser?.uid;
      
      if (!competition) {
        toast.error('Selecione uma competição', {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }

      // Criar o objeto do registro do tempo
      const timeRecord = {
        userId,
        time: parseFloat(time) || 0,
        distance: parseFloat(distance) || 0,
        date: date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      // 1. Atualizar o documento da competição
      const competitionRef = doc(db, COLLECTIONS.BASIC_COMPETITION, competition);
      await updateDoc(competitionRef, {
        times: arrayUnion(timeRecord)
      });

      // 2. Buscar ou criar documento da prova na subcoleção records do usuário
      const userRecordsRef = collection(db, COLLECTIONS.USERS, userId, 'records');
      const competitionDoc = doc(userRecordsRef, competition);

      try {
        // Tentar atualizar o documento existente
        await updateDoc(competitionDoc, {
          times: arrayUnion({
            time: parseFloat(time) || 0,
            distance: parseFloat(distance) || 0,
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
          })
        });
      } catch (error) {
        // Se o documento não existir, criar um novo
        await setDoc(competitionDoc, {
          competitionId: competition,
          competitionName: competitionName,
          competitionRef: competitionRef,
          times: [{
            time: parseFloat(time) || 0,
            distance: parseFloat(distance) || 0,
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
          }]
        });
      }

      setIsNewRecordModalOpen(false);
      toast.success('Marca registrada com sucesso!', {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      console.error('Erro ao salvar novo registro:', error);
      toast.error('Erro ao salvar registro', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <BasicLayout>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="add-record-button"
          onClick={() => setIsNewRecordModalOpen(true)}
        >
          Nova Marca
        </button>
      </div>

      {userData && (
        <div className="dashboard">
          <div className="user-notification-card">
            <div className="user-info">
              <div className="user-avatar">
                {userData.photoURL ? (
                  <img src={userData.photoURL} alt="User avatar" />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="user-details">
                <h3>{userData.displayName || 'Usuário'}</h3>
                <p>{userData.email}</p>
              </div>
            </div>
            <button 
              className="notification-button"
              onClick={() => setIsNotificationModalOpen(true)}
            >
              <FaBell size={18} />
              {hasNotifications && <span className="notification-badge">{notificationCount}</span>}
            </button>
          </div>

          <div className="level-card">
            <div className="level-info">
              <div className="level-progress-ring">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2A2A2A"
                    strokeWidth="3"
                    className="circle-bg"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="circle"
                    strokeDasharray={`${calculateLevel(userData.points || 0).progress}, 100`}
                  />
                </svg>
                <div className="level-icon-container">
                  <span className="level-icon">{calculateLevel(userData.points || 0).currentIcon}</span>
                  <span className="progress-value">{calculateLevel(userData.points || 0).progress}%</span>
                </div>
              </div>
              <div className="level-details">
                <h2 className="level-title">{calculateLevel(userData.points || 0).currentLevel}</h2>
                <p className="points-value">{userData.points || 0} PONTOS</p>
              </div>
            </div>
            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${calculateLevel(userData.points || 0).progress}%`}}
                ></div>
              </div>
              <p className="points-to-next">
                Faltam {calculateLevel(userData.points || 0).pointsToNext} pontos para o próximo nível
              </p>
            </div>
          </div>

          <div className="achievements-section">
            <div className="achievements-grid">
              {frequencyProgress && (
                <AchievementCard
                  title="Frequência"
                  progress={frequencyProgress.progress}
                  totalPoints={frequencyProgress.totalPoints}
                  icon={frequencyProgress.icon}
                  description={frequencyProgress.description}
                  fractionProgress={frequencyProgress.fractionProgress}
                />
              )}

              {distanceProgress && (
                <AchievementCard
                  title="Distância"
                  progress={distanceProgress.progress}
                  totalPoints={distanceProgress.totalPoints}
                  icon={distanceProgress.icon}
                  description={distanceProgress.description}
                  fractionProgress={distanceProgress.fractionProgress}
                />
              )}

              {timeProgress && (
                <AchievementCard
                  title="Tempo"
                  progress={timeProgress.progress}
                  totalPoints={timeProgress.totalPoints}
                  icon={timeProgress.icon}
                  description={timeProgress.description}
                  fractionProgress={timeProgress.fractionProgress}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
      />

      <NewRecordModal
        isOpen={isNewRecordModalOpen}
        onClose={() => setIsNewRecordModalOpen(false)}
        onNewRecord={handleNewRecord}
      />
      <ToastContainer />
    </BasicLayout>
  );
};

export default Dashboard;
