import React from 'react'
import { useTheme } from "styled-components";
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextInputProps } from 'react-native';

interface InputRef {
    focus(): void;
}

interface InputProps extends TextInputProps {
    name: string;
    value?: string;
    containerStyle?: { [key: string]: string | number };
}

import {
    Container,
    InputText
} from "./styles";

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({
    name,
    value,
    containerStyle,
    ...rest
}) => {

    const theme = useTheme();

    return (
        <Container style={containerStyle}>
           
           <AntDesign name="user" size={32} color="gray" />
            <InputText/>

        </Container>
    )
}

export { Input };
