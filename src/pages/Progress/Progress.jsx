import React, { useState } from 'react';
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
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import BasicLayout from '../../components/BasicLayout/BasicLayout';
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
  const [selectedTest, setSelectedTest] = useState('50m');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  // Dados de exemplo
  const mockData = {
    '50m': [
      { date: '2024-01-01', time: '00:35:50', improvement: -1.5 },
      { date: '2024-01-08', time: '00:34:20', improvement: 1.3 },
      { date: '2024-01-15', time: '00:33:80', improvement: 0.4 },
      { date: '2024-01-22', time: '00:32:50', improvement: 1.3 },
      { date: '2024-01-29', time: '00:32:10', improvement: 0.4 },
      { date: '2024-02-05', time: '00:31:80', improvement: 0.3 },
      { date: '2024-02-12', time: '00:31:20', improvement: 0.6 }
    ],
    '100m': [
      { date: '2024-01-01', time: '01:15:50', improvement: -2.0 },
      { date: '2024-01-08', time: '01:13:80', improvement: 1.7 },
      { date: '2024-01-15', time: '01:12:40', improvement: 1.4 },
      { date: '2024-01-22', time: '01:11:20', improvement: 1.2 },
      { date: '2024-01-29', time: '01:10:50', improvement: 0.7 }
    ]
  };

  const timeToSeconds = (timeStr) => {
    const [minutes, seconds, centiseconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds + centiseconds / 100;
  };

  const data = mockData[selectedTest] || [];
  const paginatedData = data.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
  const totalPages = Math.ceil(data.length / resultsPerPage);

  const chartData = {
    labels: data.map(result => new Date(result.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Tempo',
        data: data.map(result => timeToSeconds(result.time)),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0',
          callback: (value) => {
            const minutes = Math.floor(value / 60);
            const seconds = Math.floor(value % 60);
            const centiseconds = Math.round((value % 1) * 100);
            return `${minutes}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
          }
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
  };

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
              <option value="50m">50 metros livre</option>
              <option value="100m">100 metros livre</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          <h2>Evolução do Tempo - {selectedTest}</h2>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="results-list">
          <h2>Histórico de Resultados</h2>
          <div className="results-table">
            <div className="table-header">
              <div>Data</div>
              <div>Tempo</div>
              <div>Melhora</div>
            </div>
            {paginatedData.map((result, index) => (
              <div key={index} className="table-row">
                <div>{new Date(result.date).toLocaleDateString()}</div>
                <div>{result.time}</div>
                <div className="improvement">
                  {result.improvement !== 0 && (
                    <>
                      {result.improvement > 0 ? (
                        <FaArrowUp className="improvement-up" />
                      ) : (
                        <FaArrowDown className="improvement-down" />
                      )}
                      <span>{Math.abs(result.improvement)}s</span>
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
      </div>
    </BasicLayout>
  );
};

export default Progress;
