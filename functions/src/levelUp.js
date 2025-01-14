const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.onUserPointsUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    const userId = context.params.userId;

    // Calcula o nível baseado nos pontos
    const calculateLevel = (points) => {
      const levels = [
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
      ];

      for (const level of levels) {
        const [min, max] = level.range;
        if (points >= min && points <= max) {
          return level;
        }
      }
      return levels[levels.length - 1]; // Retorna o último nível se exceder
    };

    try {
      // Calcula os pontos totais
      const calculateTotalPoints = (userData) => {
        const frequencyPoints = Math.floor((userData.frequence || 0) / 5) * 5;
        const distancePoints = Math.floor((userData.distance || 0) / 1000) * 10;
        const timePoints = Math.floor((userData.totalTrainingTime || 0) / 60) * 15;
        return frequencyPoints + distancePoints + timePoints;
      };

      const newTotalPoints = calculateTotalPoints(newData);
      const previousTotalPoints = calculateTotalPoints(previousData);

      // Se houve mudança nos pontos totais
      if (newTotalPoints !== previousTotalPoints) {
        const newLevel = calculateLevel(newTotalPoints);
        const previousLevel = calculateLevel(previousTotalPoints);

        // Atualiza os pontos totais e nível no documento do usuário
        await change.after.ref.update({
          totalPoints: newTotalPoints,
          currentLevel: newLevel.name,
          levelIcon: newLevel.icon
        });

        // Se subiu de nível, cria uma notificação
        if (newLevel.name !== previousLevel.name) {
          const userRef = change.after.ref;
          const userSnapshot = await userRef.get();
          const userData = userSnapshot.data();
          
          // Cria notificação no Firestore
          const notificationRef = admin.firestore()
            .collection('users')
            .doc(userId)
            .collection('notifications');

          await notificationRef.add({
            title: 'Novo Nível Alcançado! 🎉',
            message: `Parabéns! Você alcançou o nível ${newLevel.name} ${newLevel.icon}`,
            type: 'levelUp',
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          // Se o usuário tiver um token FCM, envia notificação push
          if (userData.fcmToken) {
            const message = {
              notification: {
                title: 'Novo Nível Alcançado! 🎉',
                body: `Parabéns! Você alcançou o nível ${newLevel.name} ${newLevel.icon}`
              },
              token: userData.fcmToken
            };

            try {
              await admin.messaging().send(message);
            } catch (error) {
              console.error('Erro ao enviar notificação push:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro na função onUserPointsUpdate:', error);
    }
  });
