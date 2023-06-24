import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import LoginScreen from '../screens/Login/index';
import HomeScreen from '../screens/Main/index';
import NotificationScreen from '../screens/Notification/index';
import AccountScreen from '../screens/Account/index'; 
import NotificationContext from '../context/Notification/index';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppContent() {
  const notificationReceived = useContext(NotificationContext);
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notificações') {
            iconName = focused
              ? notificationReceived ? 'notifications' : 'notifications-outline'
              : 'notifications-outline';
            color = notificationReceived ? 'red' : color;
          } else if (route.name === 'Conta') {
            iconName = focused ? 'person' : 'person-outline';
          }
          // Esta linha define a cor do ícone
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notificações" component={NotificationScreen} />
      <Tab.Screen name="Conta" component={AccountScreen} />
    </Tab.Navigator>
  );
}  // Corrigido: as duas chaves extras foram removidas.

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="App" component={AppContent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

