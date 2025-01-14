import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import BasicLayout from '../../components/BasicLayout/BasicLayout';
import { useAuth } from '../../contexts/AuthContext';
import UserContext from '../../contexts/UserContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import { COLLECTIONS } from '../../constants/collections';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const { user: authUser } = useAuth();
  const { user: userData } = useContext(UserContext);
  const { db } = useFirebase();
  const [selectedTest, setSelectedTest] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRecords, setUserRecords] = useState({});
  const [competitions, setCompetitions] = useState([]);
  const [recordsForSelectedTest, setRecordsForSelectedTest] = useState([]);
  const [selectedTestType, setSelectedTestType] = useState(null); // 'time' ou 'distance'
  const resultsPerPage = 5;

  // Buscar os registros do usuário
  useEffect(() => {
    const fetchUserRecords = async () => {
      if (!userData?.uid) {
        return;
      }

      try {
        const recordsRef = collection(db, COLLECTIONS.USERS, userData.uid, 'records');
        const querySnapshot = await getDocs(recordsRef);
        
        // Mapear os documentos da subcoleção records
        const recordsData = {};
        const competitionsData = [];
        
        // Adicionar opção de treino livre
        recordsData['Treino Livre'] = {
          id: 'free',
          type: 'free',
          times: []
        };
        
        competitionsData.push({
          id: 'free',
          name: 'Treino Livre'
        });

        // Adicionar competições
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          recordsData[data.competitionName] = {
            id: doc.id,
            ...data
          };
          
          competitionsData.push({
            id: data.competitionId,
            name: data.competitionName
          });
        });

        setUserRecords(recordsData);
        setCompetitions(competitionsData);

        if (!selectedTest && competitionsData.length > 0) {
          setSelectedTest(competitionsData[0].name);
        }
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
      }
    };

    fetchUserRecords();
  }, [userData?.uid, db]);

  // Atualizar registros quando uma competição é selecionada
  useEffect(() => {
    if (selectedTest && userRecords[selectedTest]) {
      const record = userRecords[selectedTest];

      // Se for treino livre, buscar dados da coleção freeTraining
      if (selectedTest === 'Treino Livre') {
        const fetchFreeTrainingRecords = async () => {
          try {
            const freeTrainingRef = doc(db, COLLECTIONS.FREE_TRAINING, userData.uid);
            const freeTrainingDoc = await getDoc(freeTrainingRef);
            
            if (freeTrainingDoc.exists()) {
              const freeTrainingData = freeTrainingDoc.data();
              const times = freeTrainingData.times || [];

              // Ordenar por data
              times.sort((a, b) => new Date(a.date) - new Date(b.date));

              // Calcular melhorias
              const timesWithImprovement = times.map((time, index, array) => ({
                ...time,
                improvement: index > 0 
                  ? ((time.distance - array[index - 1].distance) / array[index - 1].distance) * 100
                  : 0
              }));

              setSelectedTestType('distance'); // Para treinos livres, sempre mostrar distância
              setRecordsForSelectedTest(timesWithImprovement);
            } else {
              setRecordsForSelectedTest([]);
            }
          } catch (error) {
            console.error('Erro ao buscar treinos livres:', error);
            setRecordsForSelectedTest([]);
          }
        };

        fetchFreeTrainingRecords();
      } else {
        // Comportamento existente para competições
        const provaType = record.type || 'distance';
        setSelectedTestType(provaType);
        
        if (record.times && record.times.length > 0) {
          const sortedTimes = record.times
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((time, index, array) => ({
              ...time,
              improvement: index > 0 
                ? provaType === 'time'
                  ? ((time.distance - array[index - 1].distance) / array[index - 1].distance) * 100
                  : ((array[index - 1].time - time.time) / array[index - 1].time) * 100
                : 0
            }));
          
          setRecordsForSelectedTest(sortedTimes);
        } else {
          setRecordsForSelectedTest([]);
        }
      }
    } else {
      setRecordsForSelectedTest([]);
      setSelectedTestType(null);
    }
  }, [selectedTest, userRecords, userData?.uid, db]);

  // Verificar se os registros têm dados de tempo e distância
  const hasTimeData = recordsForSelectedTest.some(record => record.time !== undefined && record.time !== null);
  const hasDistanceData = recordsForSelectedTest.some(record => record.distance !== undefined && record.distance !== null);

  // Dados para o gráfico de distância
  const distanceChartData = {
    labels: recordsForSelectedTest.map(record => new Date(record.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Distância (km)',
        data: recordsForSelectedTest.map(record => record.distance / 1000),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Dados para o gráfico de tempo
  const timeChartData = {
    labels: recordsForSelectedTest.map(record => new Date(record.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Tempo (min)',
        data: recordsForSelectedTest.map(record => record.time / 60),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          color: '#e2e8f0',
          boxWidth: window.innerWidth < 768 ? 20 : 40,
          padding: window.innerWidth < 768 ? 10 : 20,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: window.innerWidth < 768 ? 10 : 12
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 10 : 12
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#e2e8f0',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: window.innerWidth < 768 ? 5 : 10,
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      }
    }
  };

  // Opções específicas para cada gráfico
  const distanceOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value) {
            return value.toFixed(1) + ' km';
          }
        }
      }
    }
  };

  const timeOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value) {
            return value.toFixed(0) + ' min';
          }
        }
      }
    }
  };

  // Função para formatar o tempo em horas:minutos:segundos
  const formatTime = (seconds) => {
    if (!seconds) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Função para formatar a distância em km
  const formatDistance = (meters) => {
    if (!meters) return '0 km';
    return `${(meters / 1000).toFixed(2)} km`;
  };

  // Paginação
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = recordsForSelectedTest.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(recordsForSelectedTest.length / resultsPerPage);

  return (
    <BasicLayout>
      <div className="progress-page">
        <div className="progress-header">
          <h1>Acompanhamento de Progresso</h1>
          <div className="test-select">
            <select 
              value={selectedTest} 
              onChange={(e) => setSelectedTest(e.target.value)}
            >
              <option value="">Selecione uma prova</option>
              {competitions.map((competition) => (
                <option key={competition.id} value={competition.name}>
                  {competition.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {recordsForSelectedTest.length > 0 && (
          <>
            <div className="charts-container">
              <div className="chart-wrapper">
                <h3>Distância por Data</h3>
                <div className="chart-container">
                  <Line data={distanceChartData} options={distanceOptions} />
                </div>
              </div>
              <div className="chart-wrapper">
                <h3>Tempo por Data</h3>
                <div className="chart-container">
                  <Line data={timeChartData} options={timeOptions} />
                </div>
              </div>
            </div>

            <div className="results-list">
              <h2>Histórico de Resultados</h2>
              <div className="records-table">
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Distância</th>
                      <th>Tempo</th>
                      <th>Melhoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResults.map((record, index) => (
                      <tr key={index}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{formatDistance(record.distance)}</td>
                        <td>{formatTime(record.time)}</td>
                        <td className={record.improvement > 0 ? 'positive' : record.improvement < 0 ? 'negative' : ''}>
                          {record.improvement ? (
                            <>
                              {record.improvement > 0 ? <FaArrowUp className="improvement-icon" /> : <FaArrowDown className="improvement-icon" />}
                              {Math.abs(record.improvement).toFixed(2)}%
                            </>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </BasicLayout>
  );
};

export default Progress;
