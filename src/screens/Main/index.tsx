import { Text, View, StyleSheet, Image } from "react-native";
import {Ionicons} from '@expo/vector-icons';

export default function Main() {
    return ( 
        <View style={styles.header}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Lemon</Text>
            <Ionicons style={styles.icons} name="ios-notifications" size={30} color="black" />
            <Image source={require('../../assets/avatar.jpg')} style={styles.avatar} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: '#f2f2f2',
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 9999,
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