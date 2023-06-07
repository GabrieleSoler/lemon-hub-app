import React from 'react';
import { SafeAreaView } from 'react-native';
import { TextInput, View, StyleSheet, Button } from 'react-native';

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
                />
                <Description>Senha</Description>
                 <TextInput
                    style={styles.input}
                    placeholder="Senha"
                />
                </ContentBody>

                <ContentFooter>
                    <Button title="Entrar"/>
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
