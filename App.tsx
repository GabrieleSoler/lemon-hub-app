import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

/* async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
 */
function App() {
  /* useEffect(() => {
    requestUserPermission();

    
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!');
      console.log(JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []); */

  return <AppNavigator />;
}

export default App;
