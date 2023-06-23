import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/Login/index';
import HomeScreen from '../screens/Main/index';
import NotificationScreen from '../screens/Notification/index';
import AccountScreen from '../screens/Account/index'; // Adicione a tela de conta

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de abas para o conteúdo da aplicação
function AppContent() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notificações') {
            iconName = focused ? 'notifications' : 'notifications-outline';
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
}

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
