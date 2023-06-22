import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  sellerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0f0',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },

  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#00f',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
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
