import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, FlatList, Text, View, StyleSheet, Button,  } from 'react-native';
import api from '../../service/api';
import NavBar from "../../components/Navbar/index";



export default function NotificationScreen({ navigation  }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const response = await api.get('/meli/notifications/');
    
    if (response) {
      setNotifications(response.data);
    }
    setLoading(false);
  }

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image source={{ uri: item.extra_data.thumbnail }} style={styles.cardImage} />
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <>
    <NavBar></NavBar>
    <View style={styles.container}>
      {isLoading
        ? <ActivityIndicator size="large" color="#0000ff" />
        : <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item, index) => index.toString()}
            refreshing={isLoading}
            onRefresh={fetchNotifications}
/*             onEndReached={fetchNotifications}
            onEndReachedThreshold={0} */
          />}
    </View>

      </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30
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
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    marginTop: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
});
