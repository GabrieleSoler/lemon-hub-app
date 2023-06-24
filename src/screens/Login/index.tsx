import React, { useState } from 'react';
import { SafeAreaView, TextInput, View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../service/api';

import {
  Container,
  ContentHeader,
  Title,
  Description,
  ContentBody,
  ContentFooter
} from "./styles";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  async function CreateDeviceToken(device_token: string, plataform: string) {
    try {
      let obj = {
        device_token: device_token,
        platform: plataform,
      };
      await api
        .post("/meli/devices/", obj)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log("catch do create device " + error);
        });
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleLogin() {
    try {
      const response = await api.post('/authentication/login/', { email, password });

      if (response.status === 200) {
        await AsyncStorage.setItem('@access', response.data.access);
        await AsyncStorage.setItem('@resfresh', response.data.refresh);
        await AsyncStorage.setItem('@email', email);
        await AsyncStorage.setItem('@pass', password);
        await AsyncStorage.setItem('@userAvatarUrl', response.data.profile_picture);

        api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;

        const notificationToken = await AsyncStorage.getItem('@notification_token');
        const plataformDevice = await AsyncStorage.getItem('@plataformDevice');

        if (notificationToken && plataformDevice) {
          await CreateDeviceToken(notificationToken, plataformDevice);
        }

        navigation.navigate('App');
      } else {
        alert("Verifique seu Email e Senha");
      }
    } catch (error) {
      alert("Verifique seu Email e Senha");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <ContentHeader>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.lemonImage} />
            <Title>LEMON</Title>
          </View>
        </ContentHeader>

        <ContentBody>
          <Description>E-mail</Description>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
          <Description>Senha</Description>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </ContentBody>

        <ContentFooter>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </ContentFooter>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '80%',
    height: 60,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 30,
    paddingLeft: 30
  },
  lemonImage: {
    marginTop: 60,
    width: 60,
    height: 60,
    marginRight: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Login;
