// Sistema de níveis para o aplicativo
export const levels = [
  { name: "Bronze I", range: [0, 100], icon: "🥉" },
  { name: "Bronze II", range: [101, 200], icon: "🥉" },
  { name: "Bronze III", range: [201, 300], icon: "🥉" },
  { name: "Prata I", range: [301, 400], icon: "🥈" },
  { name: "Prata II", range: [401, 500], icon: "🥈" },
  { name: "Prata III", range: [501, 600], icon: "🥈" },
  { name: "Ouro I", range: [601, 800], icon: "🥇" },
  { name: "Ouro II", range: [801, 1000], icon: "🥇" },
  { name: "Ouro III", range: [1001, 1200], icon: "🥇" },
  { name: "Platina I", range: [1201, 1400], icon: "💎" },
  { name: "Platina II", range: [1401, 1600], icon: "💎" },
  { name: "Platina III", range: [1601, 1800], icon: "💎" },
  { name: "Diamante I", range: [1801, 2000], icon: "💠" },
  { name: "Diamante II", range: [2001, 2200], icon: "💠" },
  { name: "Diamante III", range: [2201, 2400], icon: "💠" },
  { name: "Mestre I", range: [2401, 2700], icon: "👑" },
  { name: "Mestre II", range: [2701, 3000], icon: "👑" },
  { name: "Mestre III", range: [3001, 3300], icon: "👑" },
  { name: "Expert I", range: [3301, 3600], icon: "⚔️" },
  { name: "Expert II", range: [3601, 3900], icon: "⚔️" },
  { name: "Expert III", range: [3901, 4200], icon: "⚔️" },
  { name: "Elite I", range: [4201, 4500], icon: "🏆" },
  { name: "Elite II", range: [4501, 4800], icon: "🏆" },
  { name: "Elite III", range: [4801, 5100], icon: "🏆" },
  { name: "Lenda I", range: [5101, 5500], icon: "🌟" },
  { name: "Lenda II", range: [5501, 5900], icon: "🌟" },
  { name: "Lenda III", range: [5901, 6300], icon: "🌟" },
  { name: "Mítico I", range: [6301, 6700], icon: "🔮" },
  { name: "Mítico II", range: [6701, 7100], icon: "🔮" },
  { name: "Mítico III", range: [7101, 7500], icon: "🔮" },
  { name: "Imortal I", range: [7501, 8000], icon: "⚡" },
  { name: "Imortal II", range: [8001, 8500], icon: "⚡" },
  { name: "Imortal III", range: [8501, 9000], icon: "⚡" }
];

export const calculateLevel = (points) => {
  let currentLevel = levels[0].name;
  let currentIcon = levels[0].icon;
  let nextLevelPoints = levels[0].range[1];
  let progress = 0;
  let pointsToNext = 0;

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const [min, max] = level.range;

    if (points >= min && points <= max) {
      currentLevel = level.name;
      currentIcon = level.icon;
      nextLevelPoints = max;
      const rangeSize = max - min;
      const pointsInRange = points - min;
      progress = Math.round((pointsInRange / rangeSize) * 100);
      pointsToNext = max - points;
      break;
    }
  }

  return {
    currentLevel,
    currentIcon,
    progress,
    pointsToNext
  };
};

// Cores para cada tier de nível
export const levelColors = {
  'Bronze': '#cd7f32',
  'Prata': '#c0c0c0',
  'Ouro': '#ffd700',
  'Platina': '#e5e4e2',
  'Diamante': '#b9f2ff',
  'Mestre': '#ff4646',
  'Grão-Mestre': '#ff8c00',
  'Desafiante': '#ff4d4d',
  'Elite': '#ff1493',
  'Super Elite': '#9400d3',
  'Lendário': '#4b0082',
  'Mítico': '#8a2be2',
  'Divino': '#00ffff',
  'Celestial': '#4169e1',
  'Transcendental': '#7fff00',
  'Supremo': '#ff0000',
  'Imortal': '#ffd700'
};

// Função para obter a cor do nível
export const getLevelColor = (levelName) => {
  const tier = levelName.split(' ')[0];
  return levelColors[tier] || '#ffffff';
};

// Sistema de objetivos
export const objectives = {
  frequency: { 
    baseTarget: 5, // 5 presenças para ganhar pontos extras
    points: 5, 
    icon: '🔥', 
    description: 'Complete 5 presenças para ganhar +5 pontos!',
    levelIncrease: 1 // Mantém sempre 5 presenças
  },
  distance: { 
    baseTarget: 5, // 5km para ganhar pontos extras
    points: 5, 
    icon: '🏃', 
    description: 'Complete 5km para ganhar +5 pontos!',
    levelIncrease: 1 // Mantém sempre 5km
  },
  time: { 
    baseTarget: 300, // 300 minutos (5 horas) para ganhar pontos extras
    points: 5, 
    icon: '⏱️', 
    description: 'Complete 5 horas de treino para ganhar +5 pontos!',
    levelIncrease: 1 // Mantém sempre 5 horas
  }
};

// Função para calcular progresso do objetivo
export const calculateObjectiveProgress = (type, value) => {
  (`Calculating progress for ${type} with value:`, value);
  
  const objective = objectives[type];
  if (!objective) return null;

  // Para distância, converter de metros para km
  if (type === 'distance') {
    value = value / 1000; // Converter metros para km
    ('Distance converted to km:', value);
  }

  const currentTarget = objective.baseTarget;
  const completedCycles = Math.floor(value / currentTarget);
  const currentValue = value % currentTarget;
  const progress = (currentValue / currentTarget) * 100;
  const totalPoints = completedCycles * objective.points;

  (`Progress calculation for ${type}:`, {
    currentTarget,
    completedCycles,
    currentValue,
    progress,
    totalPoints
  });

  // Formatação especial para tempo
  let formattedValue = currentValue;
  let formattedTarget = currentTarget;

  if (type === 'time') {
    // Converte minutos para horas
    formattedValue = currentValue >= 60 ? 
      `${Math.floor(currentValue / 60)}h${currentValue % 60}min` : 
      `${currentValue}min`;
    formattedTarget = '5h';
  }

  const fractionProgress = `${Math.floor(currentValue / (currentTarget / 5))}/5`;
  (`Fraction progress for ${type}:`, fractionProgress);

  return {
    progress,
    completedCycles,
    totalPoints,
    icon: objective.icon,
    target: currentTarget,
    description: objective.description,
    points: objective.points,
    currentValue: type === 'time' ? Math.floor(currentValue / 60) : currentValue,
    targetDisplay: type === 'time' ? 5 : currentTarget,
    formattedValue,
    formattedTarget,
    fractionProgress
  };
};
