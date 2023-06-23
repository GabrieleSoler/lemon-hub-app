import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { TextInput, View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../service/api';


import {
    Container,
    ContentHeader,
    Title,
    Description,
    ViewButton,
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

                api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                
                const notificationToken = await AsyncStorage.getItem('@notification_token');
                const plataformDevice = await AsyncStorage.getItem('@plataformDevice');

                if (notificationToken && plataformDevice) {
                    // Substitua esta parte com a lógica de enviar o token para o seu servidor
                    await CreateDeviceToken(notificationToken, plataformDevice);
                }

                navigation.navigate('Home');

            } else {
                alert("Erro no login");
            }
        } catch (error) {
            console.error(error);
            alert("Erro no login");
        }
    }

    return (
        <SafeAreaView>
            <Container>
                <ContentHeader>
                    <Title>LEMON</Title>
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
                    <Button title="Entrar" onPress={handleLogin} />
                </ContentFooter>
            </Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
});

export default Login; 
