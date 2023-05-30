import React, {
    forwardRef,
    useCallback,
    useState,
    useImperativeHandle,
    useRef,
    useEffect
} from 'react'
import { useTheme } from "styled-components";
import { AntDesign } from '@expo/vector-icons';
import { Text, TextInputProps } from 'react-native';

interface InputRef {
    focus(): void;
}

interface InputValueReference {
    Value: string;
}

interface InputProps extends TextInputProps {
    name: string;
    value?: string;
    // iconName?: React.ComponentProps<typeof Ionicons>["name"];
    containerStyle?: { [key: string]: string | number };
}

import {
    Container,
    InputText
} from "./styles";

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({
    // iconName,
    name,
    value,
    containerStyle,
    ...rest
}) => {

    const theme = useTheme();

    return (
        <Container style={containerStyle}>
           
           <AntDesign name="user" size={32} color="gray" />

            <InputText
            
            />

        </Container>
    )
}

export { Input };
