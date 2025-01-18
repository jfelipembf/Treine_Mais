// Sistema de níveis para o aplicativo
export const levels = [
  { name: "Bronze I", range: [0, 5], icon: "🥉" },
  { name: "Bronze II", range: [5, 10], icon: "🥉" },
  { name: "Bronze III", range: [10, 15], icon: "🥉" },
  { name: "Prata I", range: [15, 20], icon: "🥈" },
  { name: "Prata II", range: [20, 25], icon: "🥈" },
  { name: "Prata III", range: [25, 30], icon: "🥈" },
  { name: "Ouro I", range: [30, 40], icon: "🥇" },
  { name: "Ouro II", range: [40, 50], icon: "🥇" },
  { name: "Ouro III", range: [50, 60], icon: "🥇" },
  { name: "Platina I", range: [60, 80], icon: "💎" },
  { name: "Platina II", range: [80, 100], icon: "💎" },
  { name: "Platina III", range: [100, 120], icon: "💎" },
  { name: "Diamante I", range: [120, 140], icon: "💠" },
  { name: "Diamante II", range: [140, 160], icon: "💠" },
  { name: "Diamante III", range: [160, 180], icon: "💠" }
];

export const calculateLevel = (points) => {
  let currentLevel = levels[0].name;
  let currentIcon = levels[0].icon;
  let progress = 0;
  let pointsToNext = 0;
  let nextLevel = levels[1]?.name || 'Nível Máximo';

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const [min, max] = level.range;

    if (points >= min && points < max) {
      currentLevel = level.name;
      currentIcon = level.icon;
      const rangeSize = max - min;
      const pointsInRange = points - min;
      progress = Math.round((pointsInRange / rangeSize) * 100);
      pointsToNext = max - points;
      nextLevel = levels[i + 1]?.name || 'Nível Máximo';
      break;
    } else if (i === levels.length - 1 && points >= max) {
      // Se for o último nível e os pontos forem maiores que o máximo
      currentLevel = level.name;
      currentIcon = level.icon;
      progress = 100;
      pointsToNext = 0;
      nextLevel = 'Nível Máximo';
      break;
    }
  }

  return {
    currentLevel,
    currentIcon,
    progress,
    pointsToNext,
    nextLevel
  };
};

// Cores para cada tier de nível
export const levelColors = {
  'Bronze': '#cd7f32',
  'Prata': '#c0c0c0',
  'Ouro': '#ffd700',
  'Platina': '#e5e4e2',
  'Diamante': '#b9f2ff'
};

// Função para obter a cor do nível
export const getLevelColor = (levelName) => {
  const tier = levelName.split(' ')[0];
  return levelColors[tier] || '#ffffff';
};

// Sistema de objetivos
export const objectives = {
  frequency: {
    baseTarget: 1, // 1 presença = 1 ponto
    points: 1,
    icon: '🔥',
    description: 'Ganhe 1 ponto por presença!',
    levelIncrease: 1
  },
  distance: {
    baseTarget: 1000, // 1km (1000m) = 1 ponto
    points: 1,
    icon: '🏃',
    description: 'Ganhe 1 ponto por km percorrido!',
    levelIncrease: 1000
  },
  time: {
    baseTarget: 60, // 1 hora (60 minutos) = 1 ponto
    points: 1,
    icon: '⏱️',
    description: 'Ganhe 1 ponto por hora de treino!',
    levelIncrease: 60
  }
};

// Função para calcular progresso do objetivo
export const calculateObjectiveProgress = (type, value) => {
  const objective = objectives[type];
  if (!objective) return null;

  let convertedValue = value;
  let targetDisplay = objective.baseTarget;
  let formattedValue = value;
  let formattedTarget = objective.baseTarget;

  // Conversões específicas para cada tipo
  if (type === 'distance') {
    convertedValue = value / 1000; // Converter metros para km
    formattedValue = Math.floor(convertedValue * 10) / 10; // Arredondar para 1 casa decimal
    formattedTarget = '1km';
  } else if (type === 'time') {
    convertedValue = value / 60; // Converter minutos para horas
    const hours = Math.floor(convertedValue);
    const minutes = Math.floor((convertedValue - hours) * 60);
    formattedValue = hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` : `${minutes}min`;
    formattedTarget = '1h';
  }

  const completedPoints = Math.floor(convertedValue);
  const progress = ((convertedValue % 1) * 100);

  return {
    progress,
    completedPoints,
    totalPoints: completedPoints,
    icon: objective.icon,
    description: objective.description,
    points: objective.points,
    currentValue: formattedValue,
    targetDisplay: formattedTarget,
    formattedValue,
    formattedTarget
  };
};

// Achievements System
const achievements = {
  attendance: [
    { id: 'att1', title: 'Primeiro Passo', description: 'Completou seu primeiro treino', target: 1, icon: '🌱' },
    { id: 'att2', title: 'Iniciante', description: 'Completou 5 treinos', target: 5, icon: '🎯' },
    { id: 'att3', title: 'Dedicado', description: 'Completou 15 treinos', target: 15, icon: '🎯' },
    { id: 'att4', title: 'Consistente', description: 'Completou 30 treinos', target: 30, icon: '🎯' },
    { id: 'att5', title: 'Veterano', description: 'Completou 50 treinos', target: 50, icon: '🏆' },
    { id: 'att6', title: 'Mestre', description: 'Completou 100 treinos', target: 100, icon: '👑' },
    { id: 'att7', title: 'Elite', description: 'Completou 150 treinos', target: 150, icon: '💫' },
    { id: 'att8', title: 'Lendário', description: 'Completou 200 treinos', target: 200, icon: '🌟' },
    { id: 'att9', title: 'Mítico', description: 'Completou 300 treinos', target: 300, icon: '⚜️' },
    { id: 'att10', title: 'Imortal', description: 'Completou 365 treinos', target: 365, icon: '🔱' },
    { id: 'att11', title: 'Ascendente', description: 'Completou 400 treinos', target: 400, icon: '🌠' },
    { id: 'att12', title: 'Divino', description: 'Completou 450 treinos', target: 450, icon: '✨' },
    { id: 'att13', title: 'Celestial', description: 'Completou 500 treinos', target: 500, icon: '🌟' },
    { id: 'att14', title: 'Transcendente', description: 'Completou 600 treinos', target: 600, icon: '💫' },
    { id: 'att15', title: 'Infinito', description: 'Completou 700 treinos', target: 700, icon: '♾️' },
    { id: 'att16', title: 'Supremo', description: 'Completou 800 treinos', target: 800, icon: '👑' },
    { id: 'att17', title: 'Absoluto', description: 'Completou 900 treinos', target: 900, icon: '🏅' },
    { id: 'att18', title: 'Eterno', description: 'Completou 1000 treinos', target: 1000, icon: '🌌' },
    { id: 'att19', title: 'Onipresente', description: 'Completou 1500 treinos', target: 1500, icon: '🎭' },
    { id: 'att20', title: 'Omnisciente', description: 'Completou 2000 treinos', target: 2000, icon: '🌈' }
  ],
  distance: [
    { id: 'dist1', title: 'Primeiro Quilômetro', description: 'Percorra 1km', target: 1, icon: '🌱' },
    { id: 'dist2', title: 'Explorador', description: 'Percorra 10km', target: 10, icon: '🗺️' },
    { id: 'dist3', title: 'Aventureiro', description: 'Percorra 25km', target: 25, icon: '🗺️' },
    { id: 'dist4', title: 'Viajante', description: 'Percorra 50km', target: 50, icon: '🌍' },
    { id: 'dist5', title: 'Conquistador', description: 'Percorra 100km', target: 100, icon: '🌟' },
    { id: 'dist6', title: 'Lendário', description: 'Percorra 200km', target: 200, icon: '⭐' },
    { id: 'dist7', title: 'Elite', description: 'Percorra 300km', target: 300, icon: '💫' },
    { id: 'dist8', title: 'Mítico', description: 'Percorra 500km', target: 500, icon: '🏆' },
    { id: 'dist9', title: 'Supremo', description: 'Percorra 750km', target: 750, icon: '👑' },
    { id: 'dist10', title: 'Imortal', description: 'Percorra 1000km', target: 1000, icon: '⚜️' },
    { id: 'dist11', title: 'Ascendente', description: 'Percorra 1250km', target: 1250, icon: '🌠' },
    { id: 'dist12', title: 'Divino', description: 'Percorra 1500km', target: 1500, icon: '✨' },
    { id: 'dist13', title: 'Celestial', description: 'Percorra 1750km', target: 1750, icon: '🌟' },
    { id: 'dist14', title: 'Transcendente', description: 'Percorra 2000km', target: 2000, icon: '💫' },
    { id: 'dist15', title: 'Infinito', description: 'Percorra 2500km', target: 2500, icon: '♾️' },
    { id: 'dist16', title: 'Absoluto', description: 'Percorra 3000km', target: 3000, icon: '👑' },
    { id: 'dist17', title: 'Eterno', description: 'Percorra 3500km', target: 3500, icon: '🏅' },
    { id: 'dist18', title: 'Onipresente', description: 'Percorra 4000km', target: 4000, icon: '🌌' },
    { id: 'dist19', title: 'Omnisciente', description: 'Percorra 4500km', target: 4500, icon: '🎭' },
    { id: 'dist20', title: 'Universal', description: 'Percorra 5000km', target: 5000, icon: '🌈' }
  ],
  time: [
    { id: 'time1', title: 'Primeira Hora', description: 'Treine por 30 minutos', target: 30, icon: '⏰' },
    { id: 'time2', title: 'Iniciante', description: 'Treine por 60 minutos', target: 60, icon: '⏱️' },
    { id: 'time3', title: 'Dedicado', description: 'Treine por 180 minutos', target: 180, icon: '⏱️' },
    { id: 'time4', title: 'Persistente', description: 'Treine por 360 minutos', target: 360, icon: '⌛' },
    { id: 'time5', title: 'Resistente', description: 'Treine por 600 minutos', target: 600, icon: '🕒' },
    { id: 'time6', title: 'Guerreiro', description: 'Treine por 1000 minutos', target: 1000, icon: '⚡' },
    { id: 'time7', title: 'Elite', description: 'Treine por 1500 minutos', target: 1500, icon: '💫' },
    { id: 'time8', title: 'Lendário', description: 'Treine por 2000 minutos', target: 2000, icon: '🌟' },
    { id: 'time9', title: 'Mítico', description: 'Treine por 3000 minutos', target: 3000, icon: '👑' },
    { id: 'time10', title: 'Imortal', description: 'Treine por 5000 minutos', target: 5000, icon: '⚜️' },
    { id: 'time11', title: 'Ascendente', description: 'Treine por 7500 minutos', target: 7500, icon: '🌠' },
    { id: 'time12', title: 'Divino', description: 'Treine por 10000 minutos', target: 10000, icon: '✨' },
    { id: 'time13', title: 'Celestial', description: 'Treine por 12500 minutos', target: 12500, icon: '🌟' },
    { id: 'time14', title: 'Transcendente', description: 'Treine por 15000 minutos', target: 15000, icon: '💫' },
    { id: 'time15', title: 'Infinito', description: 'Treine por 17500 minutos', target: 17500, icon: '♾️' },
    { id: 'time16', title: 'Absoluto', description: 'Treine por 20000 minutos', target: 20000, icon: '👑' },
    { id: 'time17', title: 'Eterno', description: 'Treine por 25000 minutos', target: 25000, icon: '🏅' },
    { id: 'time18', title: 'Onipresente', description: 'Treine por 30000 minutos', target: 30000, icon: '🌌' },
    { id: 'time19', title: 'Omnisciente', description: 'Treine por 35000 minutos', target: 35000, icon: '🎭' },
    { id: 'time20', title: 'Universal', description: 'Treine por 40000 minutos', target: 40000, icon: '🌈' }
  ],
  streaks: [
    { id: 'streak1', title: 'Consistente', description: 'Treine 3 dias seguidos', target: 3, icon: '🔥' },
    { id: 'streak2', title: 'Dedicado', description: 'Treine 7 dias seguidos', target: 7, icon: '🔥' },
    { id: 'streak3', title: 'Focado', description: 'Treine 14 dias seguidos', target: 14, icon: '🎯' },
    { id: 'streak4', title: 'Determinado', description: 'Treine 21 dias seguidos', target: 21, icon: '💪' },
    { id: 'streak5', title: 'Disciplinado', description: 'Treine 30 dias seguidos', target: 30, icon: '🏆' },
    { id: 'streak6', title: 'Guerreiro', description: 'Treine 45 dias seguidos', target: 45, icon: '⚔️' },
    { id: 'streak7', title: 'Mestre', description: 'Treine 60 dias seguidos', target: 60, icon: '👑' },
    { id: 'streak8', title: 'Elite', description: 'Treine 75 dias seguidos', target: 75, icon: '💫' },
    { id: 'streak9', title: 'Lendário', description: 'Treine 90 dias seguidos', target: 90, icon: '🌟' },
    { id: 'streak10', title: 'Mítico', description: 'Treine 120 dias seguidos', target: 120, icon: '⚜️' },
    { id: 'streak11', title: 'Ascendente', description: 'Treine 150 dias seguidos', target: 150, icon: '🌠' },
    { id: 'streak12', title: 'Divino', description: 'Treine 180 dias seguidos', target: 180, icon: '✨' },
    { id: 'streak13', title: 'Celestial', description: 'Treine 210 dias seguidos', target: 210, icon: '🌟' },
    { id: 'streak14', title: 'Transcendente', description: 'Treine 240 dias seguidos', target: 240, icon: '💫' },
    { id: 'streak15', title: 'Infinito', description: 'Treine 270 dias seguidos', target: 270, icon: '♾️' },
    { id: 'streak16', title: 'Absoluto', description: 'Treine 300 dias seguidos', target: 300, icon: '👑' },
    { id: 'streak17', title: 'Eterno', description: 'Treine 330 dias seguidos', target: 330, icon: '🏅' },
    { id: 'streak18', title: 'Onipresente', description: 'Treine 345 dias seguidos', target: 345, icon: '🌌' },
    { id: 'streak19', title: 'Omnisciente', description: 'Treine 355 dias seguidos', target: 355, icon: '🎭' },
    { id: 'streak20', title: 'Universal', description: 'Treine 365 dias seguidos', target: 365, icon: '🌈' }
  ],
  intensity: [
    { id: 'int1', title: 'Aquecendo', description: 'Completou um treino intenso', target: 1, icon: '🌡️' },
    { id: 'int2', title: 'Energético', description: 'Completou 5 treinos intensos', target: 5, icon: '⚡' },
    { id: 'int3', title: 'Poderoso', description: 'Completou 10 treinos intensos', target: 10, icon: '💪' },
    { id: 'int4', title: 'Explosivo', description: 'Completou 20 treinos intensos', target: 20, icon: '🔥' },
    { id: 'int5', title: 'Super-Humano', description: 'Completou 30 treinos intensos', target: 30, icon: '👊' },
    { id: 'int6', title: 'Ultra Instinto', description: 'Completou 50 treinos intensos', target: 50, icon: '⚔️' },
    { id: 'int7', title: 'Além dos Limites', description: 'Completou 75 treinos intensos', target: 75, icon: '🌟' },
    { id: 'int8', title: 'Força Suprema', description: 'Completou 100 treinos intensos', target: 100, icon: '💥' },
    { id: 'int9', title: 'Poder Máximo', description: 'Completou 150 treinos intensos', target: 150, icon: '⚡' },
    { id: 'int10', title: 'Força Divina', description: 'Completou 200 treinos intensos', target: 200, icon: '🔱' },
    { id: 'int11', title: 'Poder Celestial', description: 'Completou 250 treinos intensos', target: 250, icon: '✨' },
    { id: 'int12', title: 'Força Cósmica', description: 'Completou 300 treinos intensos', target: 300, icon: '🌠' },
    { id: 'int13', title: 'Poder Transcendental', description: 'Completou 350 treinos intensos', target: 350, icon: '💫' },
    { id: 'int14', title: 'Força Infinita', description: 'Completou 400 treinos intensos', target: 400, icon: '♾️' },
    { id: 'int15', title: 'Poder Absoluto', description: 'Completou 450 treinos intensos', target: 450, icon: '👑' },
    { id: 'int16', title: 'Força Eterna', description: 'Completou 500 treinos intensos', target: 500, icon: '🏅' },
    { id: 'int17', title: 'Poder Universal', description: 'Completou 600 treinos intensos', target: 600, icon: '🌌' },
    { id: 'int18', title: 'Força Suprema', description: 'Completou 700 treinos intensos', target: 700, icon: '🎭' },
    { id: 'int19', title: 'Poder Omnisciente', description: 'Completou 800 treinos intensos', target: 800, icon: '🌈' },
    { id: 'int20', title: 'Força Definitiva', description: 'Completou 1000 treinos intensos', target: 1000, icon: '💯' }
  ],
  milestones: [
    { id: 'mile1', title: 'Iniciante', description: 'Alcance o nível 5', target: 5, icon: '🌱' },
    { id: 'mile2', title: 'Intermediário', description: 'Alcance o nível 10', target: 10, icon: '🌿' },
    { id: 'mile3', title: 'Avançado', description: 'Alcance o nível 20', target: 20, icon: '🌳' },
    { id: 'mile4', title: 'Expert', description: 'Alcance o nível 30', target: 30, icon: '🎓' },
    { id: 'mile5', title: 'Mestre', description: 'Alcance o nível 50', target: 50, icon: '👑' },
    { id: 'mile6', title: 'Elite', description: 'Alcance o nível 75', target: 75, icon: '💫' },
    { id: 'mile7', title: 'Lendário', description: 'Alcance o nível 100', target: 100, icon: '🌟' },
    { id: 'mile8', title: 'Mítico', description: 'Alcance o nível 125', target: 125, icon: '⚜️' },
    { id: 'mile9', title: 'Imortal', description: 'Alcance o nível 150', target: 150, icon: '🔱' },
    { id: 'mile10', title: 'Ascendente', description: 'Alcance o nível 175', target: 175, icon: '🌠' },
    { id: 'mile11', title: 'Divino', description: 'Alcance o nível 200', target: 200, icon: '✨' },
    { id: 'mile12', title: 'Celestial', description: 'Alcance o nível 225', target: 225, icon: '🌟' },
    { id: 'mile13', title: 'Transcendente', description: 'Alcance o nível 250', target: 250, icon: '💫' },
    { id: 'mile14', title: 'Infinito', description: 'Alcance o nível 275', target: 275, icon: '♾️' },
    { id: 'mile15', title: 'Absoluto', description: 'Alcance o nível 300', target: 300, icon: '👑' },
    { id: 'mile16', title: 'Eterno', description: 'Alcance o nível 350', target: 350, icon: '🏅' },
    { id: 'mile17', title: 'Onipresente', description: 'Alcance o nível 400', target: 400, icon: '🌌' },
    { id: 'mile18', title: 'Omnisciente', description: 'Alcance o nível 450', target: 450, icon: '🎭' },
    { id: 'mile19', title: 'Universal', description: 'Alcance o nível 500', target: 500, icon: '🌈' },
    { id: 'mile20', title: 'Definitivo', description: 'Alcance o nível 1000', target: 1000, icon: '💯' }
  ]
};

// Função específica para calcular conquistas do Dashboard
export const calculateDashboardAchievements = (userData) => {
  if (!userData) return [];

  const frequency = userData.frequence || 0;
  const distance = (userData.distance || 0) / 1000; // Convert to km
  const time = Math.floor((userData.totalTrainingTime || 0) / 60); // Convert to minutes

  const unlockedAchievements = [];

  // Check attendance achievements
  achievements.attendance.forEach(achievement => {
    if (frequency >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check distance achievements
  achievements.distance.forEach(achievement => {
    if (distance >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check time achievements
  achievements.time.forEach(achievement => {
    if (time >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  return unlockedAchievements;
};

// Função específica para obter próximas conquistas do Dashboard
export const getNextDashboardAchievements = (userData) => {
  if (!userData) return [];

  const frequency = userData.frequence || 0;
  const distance = (userData.distance || 0) / 1000; // Convert to km
  const time = Math.floor((userData.totalTrainingTime || 0) / 60); // Convert to minutes

  const nextAchievements = [];

  // Get next attendance achievement
  const nextAttendance = achievements.attendance.find(a => frequency < a.target);
  if (nextAttendance) {
    nextAchievements.push({
      ...nextAttendance,
      category: 'attendance',
      progress: Math.min(100, (frequency / nextAttendance.target) * 100)
    });
  }

  // Get next distance achievement
  const nextDistance = achievements.distance.find(a => distance < a.target);
  if (nextDistance) {
    nextAchievements.push({
      ...nextDistance,
      category: 'distance',
      progress: Math.min(100, (distance / nextDistance.target) * 100)
    });
  }

  // Get next time achievement
  const nextTime = achievements.time.find(a => time < a.target);
  if (nextTime) {
    nextAchievements.push({
      ...nextTime,
      category: 'time',
      progress: Math.min(100, (time / nextTime.target) * 100)
    });
  }

  return nextAchievements;
};

export const calculateAchievements = (userData) => {
  if (!userData) return [];

  const frequency = userData.frequence || 0;
  const distance = (userData.distance || 0) / 1000; // Convert to km
  const time = Math.floor((userData.totalTrainingTime || 0) / 60); // Convert to minutes
  const streak = userData.currentStreak || 0;
  const intensiveWorkouts = userData.intensiveWorkouts || 0;
  const level = userData.level || 0;

  const unlockedAchievements = [];

  // Check attendance achievements
  achievements.attendance.forEach(achievement => {
    if (frequency >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check distance achievements
  achievements.distance.forEach(achievement => {
    if (distance >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check time achievements
  achievements.time.forEach(achievement => {
    if (time >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check streak achievements
  achievements.streaks.forEach(achievement => {
    if (streak >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check intensity achievements
  achievements.intensity.forEach(achievement => {
    if (intensiveWorkouts >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  // Check milestone achievements
  achievements.milestones.forEach(achievement => {
    if (level >= achievement.target) {
      unlockedAchievements.push(achievement);
    }
  });

  return unlockedAchievements;
};

export const getNextAchievements = (userData) => {
  if (!userData) return [];

  const frequency = userData.frequence || 0;
  const distance = (userData.distance || 0) / 1000; // Convert to km
  const time = Math.floor((userData.totalTrainingTime || 0) / 60); // Convert to minutes
  const streak = userData.currentStreak || 0;
  const intensiveWorkouts = userData.intensiveWorkouts || 0;
  const level = userData.level || 0;

  const nextAchievements = [];

  // Helper function to find next achievement
  const findNextAchievement = (category, currentValue) => {
    const next = achievements[category].find(a => currentValue < a.target);
    if (next) {
      nextAchievements.push({
        ...next,
        category,
        progress: Math.min(100, (currentValue / next.target) * 100)
      });
    }
  };

  // Get next achievements for each category
  findNextAchievement('attendance', frequency);
  findNextAchievement('distance', distance);
  findNextAchievement('time', time);
  findNextAchievement('streaks', streak);
  findNextAchievement('intensity', intensiveWorkouts);
  findNextAchievement('milestones', level);

  return nextAchievements;
};
