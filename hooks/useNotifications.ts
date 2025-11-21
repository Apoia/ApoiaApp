import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import apiService from '../utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_TOKEN_KEY = '@apoiaapp:notification_token';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Verificar status de permissão atual
    verificarPermissao();

    // Listener para notificações recebidas enquanto o app está em foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Listener para quando o usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notificação tocada:', response);
      // Aqui você pode navegar para uma tela específica baseado no tipo de notificação
      const data = response.notification.request.content.data;
      if (data?.tipo === 'despesa_fixa_vencendo') {
        // Navegar para despesas fixas
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const verificarPermissao = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        // Se já tem permissão, registrar token
        const token = await obterToken();
        if (token) {
          setExpoPushToken(token);
          salvarTokenNoServidor(token);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
    }
  };

  const solicitarPermissao = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (!Device.isDevice) {
        console.log('Dispositivo físico necessário para notificações push');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus);

      if (finalStatus === 'granted') {
        const token = await obterToken();
        if (token) {
          setExpoPushToken(token);
          await salvarTokenNoServidor(token);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const obterToken = async (): Promise<string | null> => {
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '63918df9-23d2-4330-ba31-5eae39085fae', // Do app.json
      });
      return tokenData.data;
    } catch (e) {
      console.error('Erro ao obter token de notificação:', e);
      return null;
    }
  };

  const salvarTokenNoServidor = async (token: string) => {
    try {
      // Verificar se já salvou este token
      const tokenSalvo = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);
      if (tokenSalvo === token) {
        return; // Token já está salvo
      }

      const response = await apiService.post('/notificacoes/registrar-token', {
        token,
        plataforma: 'expo',
        device_id: Device.modelName || null,
      });

      if (response.success) {
        await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
        console.log('Token de notificação registrado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao registrar token de notificação:', error);
    }
  };

  return {
    expoPushToken,
    notification,
    permissionStatus,
    solicitarPermissao,
    verificarPermissao,
  };
}


