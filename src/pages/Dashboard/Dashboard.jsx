import React, { useState, useEffect, useContext } from 'react';
import { FaTrophy, FaBolt, FaRuler, FaBell, FaUser, FaShare, FaShareAlt, FaPlus, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { doc, updateDoc, arrayUnion, collection, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasicLayout from '../../components/BasicLayout/BasicLayout';
import NotificationModal from '../../components/Modal/NotificationModal';
import NewRecordModal from '../../components/Modal/NewRecordModal';
import { useAuth } from '../../contexts/AuthContext';
import UserContext from '../../contexts/UserContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import { COLLECTIONS } from '../../constants/collections';
import { calculateLevel, getLevelColor, calculateObjectiveProgress, objectives, calculateDashboardAchievements, getNextDashboardAchievements } from '../../utils/levelSystem';
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
  const [activeTab, setActiveTab] = useState('next');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  // Calcula pontos totais:
  // - 1 ponto por km
  // - 1 ponto por hora
  // - 1 ponto por dia de treino
  const calculateTotalPoints = () => {
    if (!userData) return 0;

    // Pontos por distância (1 ponto por km)
    const distancePoints = Math.floor((userData.distance || 0) / 1000);

    // Pontos por tempo (1 ponto por hora)
    const timePoints = Math.floor((userData.totalTrainingTime || 0) / 3600);

    // Pontos por frequência (1 ponto por dia)
    const frequencyPoints = userData.frequence || 0;

    return distancePoints + timePoints + frequencyPoints;
  };

  // Calcula pontos totais como soma das métricas
  const totalPoints = calculateTotalPoints();

  // Calcula o nível com base nos pontos totais
  const userLevel = calculateLevel(totalPoints);

  // Efeito para verificar e atualizar pontos quando houver progresso
  useEffect(() => {
    if (frequencyProgress) {
      // Aqui você pode implementar a lógica para atualizar pontos no Firestore
      // Por enquanto vamos apenas exibir uma mensagem
      ('Parabéns! Você completou um objetivo de frequência!');
    }
    if (distanceProgress) {
      // Aqui você pode implementar a lógica para atualizar pontos no Firestore
      // Por enquanto vamos apenas exibir uma mensagem
      ('Parabéns! Você completou um objetivo de distância!');
    }
    if (timeProgress) {
      // Aqui você pode implementar a lógica para atualizar pontos no Firestore
      // Por enquanto vamos apenas exibir uma mensagem
      ('Parabéns! Você completou um objetivo de tempo!');
    }
  }, [frequencyProgress, distanceProgress, timeProgress]);

  const AchievementCard = ({ title, progress, totalPoints, icon, description, fractionProgress, currentValue }) => {
    const getNextObjective = () => {
      const type = title.toLowerCase().includes('frequência') ? 'frequency' : 
                  title.toLowerCase().includes('distância') ? 'distance' : 'time';
      const baseTarget = objectives[type].baseTarget;
      const currentLevel = Math.floor(currentValue / baseTarget);
      const nextTarget = (currentLevel + 1) * baseTarget;
      return nextTarget;
    };

    const nextObjective = getNextObjective();

    return (
      <div className="achievement-card">
        <div className="achievement-header">
          <div className="achievement-icon-wrapper">
            {icon}
          </div>
          <div className="achievement-info">
            <h3>{title}</h3>
            <div className="points-info">
              <span className="current-value">{currentValue}</span>
              <span className="separator">/</span>
              <span className="next-value">{nextObjective}</span>
            </div>
          </div>
        </div>
        <div className="achievement-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{fractionProgress}</div>
        </div>
      </div>
    );
  };

  const handleNewRecord = async (recordData) => {
    try {
      const { type, competition, competitionName, time, timeStr, distance, date } = recordData;
      const userId = userData?.uid || authUser?.uid;
      
      // Only validate competition if it's a competition type record
      if (type === 'competition' && !competition) {
        toast.error('Selecione uma competição', {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }

      // Get user reference and current data for both competition and free records
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};
      const timeInSeconds = parseFloat(time) || 0;
      const distanceValue = parseFloat(distance) || 0;

      if (type === 'competition') {
        // 1. Atualizar o documento da competição
        const competitionRef = doc(db, COLLECTIONS.BASIC_COMPETITION, competition);
        const timeRecord = {
          userId,
          time: timeInSeconds,
          distance: distanceValue,
          date: date || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };

        await updateDoc(competitionRef, {
          times: arrayUnion(timeRecord)
        });

        // 2. Atualizar a subcoleção records do usuário
        const userRecordsRef = collection(db, COLLECTIONS.USERS, userId, 'records');
        const competitionDoc = doc(userRecordsRef, competition);

        try {
          await updateDoc(competitionDoc, {
            times: arrayUnion({
              time: timeInSeconds,
              distance: distanceValue,
              date: date || new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString()
            })
          });
        } catch (error) {
          await setDoc(competitionDoc, {
            competitionId: competition,
            competitionName: competitionName,
            competitionRef: competitionRef,
            times: [{
              time: timeInSeconds,
              distance: distanceValue,
              date: date || new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString()
            }]
          });
        }

        // 3. Atualizar as estatísticas gerais do usuário
        await updateDoc(userRef, {
          distance: (currentData.distance || 0) + distanceValue,
          frequence: (currentData.frequence || 0) + 1,
          totalTrainingTime: (currentData.totalTrainingTime || 0) + timeInSeconds
        });
      } else {
        // Handle free record - update user's main document
        await updateDoc(userRef, {
          distance: (currentData.distance || 0) + distanceValue,
          frequence: (currentData.frequence || 0) + 1,
          totalTrainingTime: (currentData.totalTrainingTime || 0) + timeInSeconds
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

  const handleShare = (achievement, event) => {
    event.stopPropagation();
    setSelectedAchievement(achievement);
    setIsShareModalOpen(true);
  };

  const ShareModal = () => {
    if (!isShareModalOpen || !selectedAchievement) return null;

    const achievementEmoji = selectedAchievement.title.toLowerCase().includes('frequência') ? '🏃‍♂️' :
                           selectedAchievement.title.toLowerCase().includes('distância') ? '🎯' : '⏱️';
    
    const shareText = encodeURIComponent(
      `${achievementEmoji} Nova Conquista Desbloqueada no Treine+! ${achievementEmoji}\n\n` +
      `🏆 ${selectedAchievement.title}\n` +
      `📝 ${selectedAchievement.description}\n\n` +
      `Venha treinar comigo! 💪`
    );

    const handleModalClick = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        setIsShareModalOpen(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={handleModalClick}>
        <div className="share-modal">
          <button 
            className="close-button"
            onClick={() => setIsShareModalOpen(false)}
            aria-label="Fechar"
          >
            
          </button>
          <h3 className="share-modal-title">Compartilhar Conquista</h3>
          <div className="share-modal-content">
            <div className="achievement-preview">
              <div className="achievement-icon-large">
                {selectedAchievement.icon}
              </div>
              <div className="achievement-details">
                <h4>{selectedAchievement.title}</h4>
                <p>{selectedAchievement.description}</p>
              </div>
            </div>
            <div className="share-options">
              <a 
                href={`whatsapp://send?text=${shareText}`}
                className="share-option whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
              >
                <FaWhatsapp />
                <span>Compartilhar no WhatsApp</span>
              </a>
　
　
　
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${shareText}`}
                className="share-option facebook"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
              >
                <FaFacebook />
                <span>Compartilhar no Facebook</span>
              </a>
　
　
　
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                className="share-option twitter"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
              >
                <FaTwitter />
                <span>Compartilhar no Twitter</span>
              </a>

              <a 
                href={`https://www.instagram.com/share?url=${window.location.href}`}
                className="share-option instagram"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
              >
                <FaInstagram />
                <span>Compartilhar no Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BasicLayout>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {userData && (
        <div className="dashboard">
          <div className="user-notification-card">
            <div className="user-info">
              <div className="user-avatar">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Avatar" />
                ) : (
                  <FaUser className="FaUser" />
                )}
              </div>
              <div className="user-details">
                <h3>{userData?.name || 'Usuário'}</h3>
                <p>{userData?.email || 'email@exemplo.com'}</p>
              </div>
              <button 
                className="notification-button"
                onClick={() => setIsNotificationModalOpen(true)}
              >
                <FaBell />
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </button>
            </div>
          </div>
          <button className="add-mark-button" onClick={() => setIsNewRecordModalOpen(true)}>
              <FaPlus /> Adicionar Marca
            </button>

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
                    stroke="#3E54AC"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="circle"
                    strokeDasharray={`${userLevel.progress}, 100`}
                  />
                </svg>
                <div className="level-icon-container">
                  <span className="level-icon">{userLevel.currentIcon}</span>
                  <div className="progress-details">
                    <span className="progress-value">{totalPoints}</span>
                    <span className="progress-separator">/</span>
                    <span className="next-level-points">{totalPoints + userLevel.pointsToNext}</span>
                  </div>
                </div>
              </div>
              <div className="level-details">
                <h2 className="level-title">{userLevel.currentLevel}</h2>
                <p className="points-value">PONTOS TOTAIS</p>
              </div>
            </div>
            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${userLevel.progress}%`}}
                ></div>
              </div>
              <p className="points-to-next">
                Faltam {userLevel.pointsToNext} pontos para {userLevel.nextLevel}
              </p>
            </div>
          </div>

          <div className="achievements-section">
  
            <div className="achievements-list">
              {userData?.achievements?.map((achievement, index) => (
                <div key={index} className="achievement-item unlocked">
                  <div className="achievement-icon-wrapper">
                    <div className="achievement-icon">{achievement.icon}</div>
                  </div>
                  <div className="achievement-info">
                    <div className="achievement-header">
                      <span className="achievement-name">{achievement.title}</span>
                    </div>
                    <div className="achievement-description">{achievement.description}</div>
                  </div>
                  <button 
                    className="share-button"
                    onClick={(e) => handleShare(achievement, e)}
                    title="Compartilhar conquista"
                  >
                    <FaShare />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card de Métricas */}
          <div className="px-4 mt-10 mb-10">
            <div className="metrics-card">
              <div className="metric-info">
                <div className="metric-content">
                  <span className="metric-value">{userData?.frequence || 0}</span>
                  <span className="metric-unit">presenças</span>
                </div>
                <span className="metric-title">Frequência</span>
              </div>

              <div className="metric-info">
                <div className="metric-content">
                  <span className="metric-value">{((userData?.distance || 0) / 1000).toFixed(1)}</span>
                  <span className="metric-unit">km</span>
                </div>
                <span className="metric-title">Distância</span>
              </div>

              <div className="metric-info">
                <div className="metric-content">
                  <span className="metric-value">
                    {Math.floor((userData?.totalTrainingTime || 0) / 60)}
                  </span>
                  <span className="metric-unit">min</span>
                </div>
                <span className="metric-title">Tempo Total</span>
              </div>
            </div>
          </div>

          {/* Card de Conquistas */}
          <div className="px-4 mt-6">
            <div className="achievements-card">
              <div className="achievements-header">
                <h3 className="achievements-title">Conquistas</h3>
                <div className="achievements-summary">
                  <span className="achievements-count">
                    {calculateDashboardAchievements(userData).length} Conquistas
                  </span>
                </div>
              </div>

              <div className="achievements-tabs">
                <button 
                  className={`achievement-tab ${activeTab === 'next' ? 'active' : ''}`}
                  onClick={() => setActiveTab('next')}
                >
                  Próximas
                </button>
                <button 
                  className={`achievement-tab ${activeTab === 'unlocked' ? 'active' : ''}`}
                  onClick={() => setActiveTab('unlocked')}
                >
                  Desbloqueadas
                </button>
              </div>

              <div className="achievements-content">
                {activeTab === 'next' ? (
                  // Próximas Conquistas
                  <div className="achievements-grid">
                    {getNextDashboardAchievements(userData).map((achievement) => (
                      <div key={achievement.id} className="achievement-item">
                        <div className="achievement-icon-wrapper">
                          <div className="achievement-icon">{achievement.icon}</div>
                          <div 
                            className="achievement-progress-ring"
                            style={{
                              background: `conic-gradient(#3E54AC ${achievement.progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                            }}
                          />
                        </div>
                        <div className="achievement-info">
                          <div className="achievement-header">
                            <span className="achievement-name">{achievement.title}</span>
                            <span className="achievement-progress">{Math.round(achievement.progress)}%</span>
                          </div>
                          <div className="achievement-description">{achievement.description}</div>
                          <div className="achievement-bar">
                            <div 
                              className="achievement-progress-fill"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Conquistas Desbloqueadas
                  <div className="achievements-grid">
                    {calculateDashboardAchievements(userData).map((achievement) => (
                      <div key={achievement.id} className="achievement-item unlocked">
                        <div className="achievement-icon-wrapper">
                          <div className="achievement-icon">{achievement.icon}</div>
                        </div>
                        <div className="achievement-info">
                          <div className="achievement-header">
                            <span className="achievement-name">{achievement.title}</span>
                          </div>
                          <div className="achievement-description">{achievement.description}</div>
                        </div>
                        <button 
                          className="share-button"
                          onClick={(e) => handleShare(achievement, e)}
                          title="Compartilhar conquista"
                        >
                          <FaShare />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
        onSubmit={handleNewRecord}
      />
      <ToastContainer />
      <ShareModal />
    </BasicLayout>
  );
};

export default Dashboard;
