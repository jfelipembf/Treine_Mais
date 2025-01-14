import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../contexts/FirebaseContext';
import { COLLECTIONS } from '../constants/collections';

export const useNotifications = () => {
  const [notification, setNotification] = useState(null);
  const { currentUser } = useAuth();
  const { db } = useFirebase();

  useEffect(() => {
    if (!currentUser) return;

    const setupFCM = async () => {
      try {
        const messaging = getMessaging();
        
        // Solicita permissão para notificações
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          ('Permissão de notificação negada');
          return;
        }

        // Obtém o token FCM
        const token = await getToken(messaging, {
          vapidKey: 'SEU_VAPID_KEY_AQUI' // Você precisa gerar esta chave no console do Firebase
        });

        // Salva o token no documento do usuário
        const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
        await updateDoc(userRef, {
          fcmToken: token
        });

        // Configura o listener para mensagens em primeiro plano
        onMessage(messaging, (payload) => {
          setNotification(payload.notification);
        });
      } catch (error) {
        console.error('Erro ao configurar notificações:', error);
      }
    };

    setupFCM();
  }, [currentUser, db]);

  return { notification };
};
