import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f2f2f2',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 5
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
        justifyContent: 'space-between',
      },
      logo: {
        width: 40,
        height: 40,
        marginRight: 10
      },
      icons: {
        marginLeft: 'auto',
        margin: 5
      },
      avatar: {
        marginLeft: 'auto',
        width: 40,
        height: 40,
        margin: 0,
        borderRadius: 20
      },
});

const NavBar = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    async function fetchAvatarUrl() {
      const url = await AsyncStorage.getItem('@userAvatarUrl');
      setAvatarUrl(url);
    }

    fetchAvatarUrl();
  }, []);

  return (
    <View style={styles.header}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Lemon</Text>
      {avatarUrl ? <Image source={{uri: avatarUrl}} style={styles.avatar} /> : null}
    </View>
  );
};

export default NavBar;
