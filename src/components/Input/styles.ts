import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { TextInput } from "react-native";

export const Container = styled.View`
    width: 85%;
    height: ${RFValue(50)}px;
    flex-direction: row;
    margin-bottom: ${RFValue(10)}px;
    background-color: ${({ theme }) => theme.COLORS.GRAY5};
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

export const InputText = styled(TextInput)`
    flex: 1;
    font-size: ${RFValue(12)}px;
    border-top-right-radius: ${RFValue(5)}px;
    border-bottom-right-radius: ${RFValue(5)}px;
    color: ${({ theme }) => theme.COLORS.GRAY4};
    font-family: ${({ theme }) => theme.FONTS.POPPINSLIGHT};
    background-color: ${({ theme }) => theme.COLORS.GRAY5};
`