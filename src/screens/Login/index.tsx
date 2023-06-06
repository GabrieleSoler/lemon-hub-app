import React from 'react';
import { SafeAreaView } from 'react-native';

import {
    Container,
    ContentHeader,
    Title,
    Description,
    ViewButton,
    ContentBody,
    ContentFooter
} from "./styles";
import { Input } from '../../components/Input';

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
                    <Input name={'a'} />
                </ContentBody>

                <ContentFooter>

                </ContentFooter>
            </Container>
        </SafeAreaView>
      
    );
}

export default Login; 
