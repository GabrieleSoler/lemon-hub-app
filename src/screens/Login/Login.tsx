import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { Input } from ".././../components/Input/Input"
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

                    <Description>Faça o login</Description>
                    
                    <ViewButton></ViewButton>
                </ContentHeader>

                <ContentBody>
                    <Input name='gabs'/>
                </ContentBody>

                <ContentFooter>

                </ContentFooter>
            </Container>
        </SafeAreaView>
      
    );
}

export { Login }; 
