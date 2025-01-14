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
import { collection, query, getDocs } from 'firebase/firestore';
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
      console.log('AuthUser:', authUser);
      console.log('UserData:', userData);
      
      if (!userData?.uid) {
        console.log('Nenhum usuário carregado');
        return;
      }

      try {
        console.log('Buscando registros para o usuário:', userData.uid);
        const recordsRef = collection(db, COLLECTIONS.USERS, userData.uid, 'records');
        console.log('Referência da coleção:', recordsRef);
        
        const querySnapshot = await getDocs(recordsRef);
        console.log('Documentos encontrados:', querySnapshot.docs.length);
        console.log('Documentos:', querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
        
        // Mapear os documentos da subcoleção records
        const recordsData = {};
        const competitionsData = [];
        
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log('Documento da prova:', data);
          
          // Guardar os dados da prova usando o competitionName como chave
          recordsData[data.competitionName] = {
            id: doc.id,
            ...data
          };
          
          // Adicionar à lista de competições
          competitionsData.push({
            id: data.competitionId,
            name: data.competitionName
          });
        });

        console.log('Records processados:', recordsData);
        console.log('Competições disponíveis:', competitionsData);

        setUserRecords(recordsData);
        setCompetitions(competitionsData);

        // Selecionar primeira competição se não houver seleção
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
    console.log('Competição selecionada:', selectedTest);
    console.log('Dados disponíveis:', userRecords);
    
    if (selectedTest && userRecords[selectedTest]) {
      const record = userRecords[selectedTest];
      console.log('Dados da competição:', record);

      // Usar o tipo da competição diretamente
      const provaType = record.type || 'distance';
      console.log('Tipo da prova:', provaType);
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
        
        console.log('Tempos processados:', sortedTimes);
        setRecordsForSelectedTest(sortedTimes);
      } else {
        setRecordsForSelectedTest([]);
      }
    } else {
      setRecordsForSelectedTest([]);
      setSelectedTestType(null);
    }
  }, [selectedTest, userRecords]);

  // Verificar se os registros têm dados de tempo e distância
  const hasTimeData = recordsForSelectedTest.some(record => record.time !== undefined && record.time !== null);
  const hasDistanceData = recordsForSelectedTest.some(record => record.distance !== undefined && record.distance !== null);

  // Calcular estatísticas de desempenho
  const calculatePerformanceStats = () => {
    if (recordsForSelectedTest.length < 2 || !selectedTestType) return null;

    const sortedByDate = [...recordsForSelectedTest].sort((a, b) => new Date(a.date) - new Date(b.date));
    const first = sortedByDate[0];
    const last = sortedByDate[sortedByDate.length - 1];

    if (selectedTestType === 'time') {
      // Para provas de tempo fixo, analisamos a distância percorrida
      return {
        type: 'time',
        fixedValue: first.time || last.time, // Usar o tempo que estiver disponível
        initial: first.distance,
        current: last.distance,
        // Melhoria é positiva se a distância aumentou
        improvement: ((last.distance - first.distance) / first.distance) * 100
      };
    } else {
      // Para provas de distância fixa, analisamos o tempo gasto
      return {
        type: 'distance',
        fixedValue: first.distance,
        initial: first.time,
        current: last.time,
        // Melhoria é positiva se o tempo diminuiu
        improvement: ((first.time - last.time) / first.time) * 100
      };
    }
  };

  const performanceStats = calculatePerformanceStats();

  // Dados para o gráfico
  const chartData = {
    labels: recordsForSelectedTest.length > 0 
      ? recordsForSelectedTest.map(record => new Date(record.date).toLocaleDateString())
      : [],
    datasets: [{
      label: selectedTestType === 'time' 
        ? 'Distância (metros)' // Se for prova de tempo, mostra a distância
        : 'Tempo (minutos)',   // Se for prova de distância, mostra o tempo
      data: selectedTestType === 'time'
        ? recordsForSelectedTest.map(record => record.distance) // Mostra a distância para provas de tempo
        : recordsForSelectedTest.map(record => record.time),    // Mostra o tempo para provas de distância
      borderColor: selectedTestType === 'time' ? 'rgb(255, 159, 64)' : 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  console.log('Tipo de prova selecionado:', selectedTestType);
  console.log('Dados do gráfico:', chartData);
  console.log('Dados para o gráfico:', recordsForSelectedTest.map(r => 
    selectedTestType === 'time' ? r.distance : r.time
  ));

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0'
        }
      },
      title: {
        display: true,
        text: title,
        color: '#e2e8f0'
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0'
        }
      }
    }
  });

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

        {performanceStats && (
          <div className="performance-card">
            <h3>
              {performanceStats.type === 'time' 
                ? `Desempenho em ${performanceStats.fixedValue} minutos`
                : `Desempenho em ${performanceStats.fixedValue} metros`
              }
            </h3>
            <div className="performance-stats">
              <div className="stat">
                <span className="label">
                  {performanceStats.type === 'time' ? 'Distância Inicial:' : 'Tempo Inicial:'}
                </span>
                <span className="value">
                  {performanceStats.type === 'time'
                    ? `${performanceStats.initial}m`
                    : `${performanceStats.initial.toFixed(2)} min`
                  }
                </span>
              </div>
              <div className="stat">
                <span className="label">
                  {performanceStats.type === 'time' ? 'Distância Atual:' : 'Tempo Atual:'}
                </span>
                <span className="value">
                  {performanceStats.type === 'time'
                    ? `${performanceStats.current}m`
                    : `${performanceStats.current.toFixed(2)} min`
                  }
                </span>
              </div>
              <div className="stat">
                <span className="label">Evolução:</span>
                <span className={`value ${performanceStats.improvement > 0 ? 'positive' : 'negative'}`}>
                  {performanceStats.improvement > 0 ? (
                    <FaArrowUp className="improvement-up" />
                  ) : (
                    <FaArrowDown className="improvement-down" />
                  )}
                  {Math.abs(performanceStats.improvement).toFixed(1)}%
                  {performanceStats.type === 'time'
                    ? performanceStats.improvement > 0
                      ? ' mais distância'
                      : ' menos distância'
                    : performanceStats.improvement > 0
                      ? ' mais rápido'
                      : ' mais lento'
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {recordsForSelectedTest.length > 0 && selectedTestType && (
          <div className="chart-container">
            <h2>
              {selectedTestType === 'time'
                ? `Distância percorrida em ${recordsForSelectedTest[0].time} minutos`
                : `Tempo para percorrer ${recordsForSelectedTest[0].distance} metros`
              }
            </h2>
            <Line 
              data={chartData}
              options={chartOptions(
                selectedTestType === 'time'
                  ? `Distância percorrida em ${recordsForSelectedTest[0].time} minutos`
                  : `Tempo para percorrer ${recordsForSelectedTest[0].distance} metros`
              )} 
            />
          </div>
        )}

        {recordsForSelectedTest.length > 0 && (
          <div className="results-list">
            <h2>Histórico de Resultados</h2>
            <div className="results-table">
              <div className={`table-header ${selectedTestType === 'time' ? 'time-test' : 'distance-test'}`}>
                <div>Data</div>
                {selectedTestType === 'time' ? (
                  <div>Distância</div>
                ) : (
                  <div>Tempo</div>
                )}
                <div>Melhora</div>
              </div>
              {currentResults.map((result, index) => (
                <div key={index} className={`table-row ${selectedTestType === 'time' ? 'time-test' : 'distance-test'}`}>
                  <div>{new Date(result.date).toLocaleDateString()}</div>
                  {selectedTestType === 'time' ? (
                    <div>{result.distance}m</div>
                  ) : (
                    <div>{result.time.toFixed(2)} min</div>
                  )}
                  <div className="improvement">
                    {result.improvement !== 0 && (
                      <>
                        {result.improvement > 0 ? (
                          <FaArrowUp className="improvement-up" />
                        ) : (
                          <FaArrowDown className="improvement-down" />
                        )}
                        <span>{Math.abs(result.improvement).toFixed(1)}%</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
        )}
      </div>
    </BasicLayout>
  );
};

export default Progress;
