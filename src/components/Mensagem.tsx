import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  sellerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#AEDFFA', // Azul claro
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10,
    maxWidth: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff', // Branco
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 10,
    maxWidth: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

const Message = ({message, isSeller}: {message: string, isSeller: boolean}) => {
  const messageStyle = isSeller ? styles.sellerMessage : styles.userMessage;
  
  return (
    <View style={messageStyle}>
      <Text>{message}</Text>
    </View>
  );
}

export default Message;
