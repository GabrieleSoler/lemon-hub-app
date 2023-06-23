import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login/index';
import HomeScreen from '../screens/Main/index';
import NotificationScreen from '../screens/Notification/index';


const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name='Notification' component={NotificationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
