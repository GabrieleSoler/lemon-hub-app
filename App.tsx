import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationProvider } from './src/context/Notification/index';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationReceived, setNotificationReceived] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log(token));

    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
      setNotificationReceived(true);
      incrementNotificationCount();
    });

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      incrementNotificationCount();
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  const incrementNotificationCount = () => {
    setNotificationCount(count => count + 1);
  }

  useEffect(() => {
    Notifications.setBadgeCountAsync(notificationCount);
  }, [notificationCount]);

  return (
    <NotificationProvider value={notificationReceived}>
      <AppNavigator />
    </NotificationProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    console.log(Platform.OS)
    await AsyncStorage.setItem('@plataformDevice', Platform.OS);
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    await AsyncStorage.setItem('@notification_token', token);

  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
