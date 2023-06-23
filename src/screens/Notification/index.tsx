import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, FlatList, Text, View, StyleSheet, Button } from 'react-native';
import api from '../../service/api';


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
    
    <View style={styles.container}>

      <Button title="Voltar" onPress={() => navigation.goBack()} /> 

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
  );
}

NotificationScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: "Notificações",
  headerLeft: () => (
    <Button
      onPress={() => navigation.goBack()}
      title="Voltar"
      color="#000"
    />
  ),
  headerStyle: {
    backgroundColor: '#f4511e',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
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
