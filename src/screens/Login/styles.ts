import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View``;

export const ContentHeader = styled.View`
    align-items: center;
    justify-content: center;
    padding: ${RFValue(10)}px;
`;

export const Title = styled.Text`
    text-align: center;
    font-size: ${RFValue(30)}px;
    margin-top: ${RFValue(40)}px;
    font-family: ${({ theme }) => theme.FONTS.POPPINSMEDIUM};
`;

export const Description = styled.Text`
    margin-top: ${RFValue(60)}px;    
    font-size: ${RFValue(17)}px;
    font-family: ${({ theme }) => theme.FONTS.POPPINSLIGHT};
`;

export const ViewButton = styled.View``;

export const ContentBody = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ContentFooter = styled.View``;