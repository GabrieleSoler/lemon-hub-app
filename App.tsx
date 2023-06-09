import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from "react-native";
import React from "react";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components/native";

import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_800ExtraBold
} from "@expo-google-fonts/poppins";

import { DMSans_400Regular } from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";

import COLORS from "./src/styles/theme";

import Login from "./src/screens/Login";
import Main from './src/screens/Main';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    DMSans_400Regular,
    DMSerifDisplay_400Regular
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={COLORS}>
      <StatusBar style='dark' translucent backgroundColor='transparent' />
        {/*// TODO: Habilitar na implementação das routes
        <ScrollView style={{backgroundColor:'#e4e4e4'}} >
          <Main/>    
        </ScrollView >
        */}
        <View>
          <Login />
        </View>
   </ThemeProvider>
  );
}

