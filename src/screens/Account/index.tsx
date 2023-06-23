import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, FlatList } from 'react-native';  // Import FlatList
import api from '../../service/api';
import NavBar from "../../components/Navbar/index";

export default function Account() {
  const [account, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [contas, setContas] = useState([]);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const response = await api.get('/meli/usuario/');
      const responseContas = await api.get('/meli/contas/');
      setAccount(response.data);
      setContas(responseContas.data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const renderConta = ({ item }) => {
    // Formatar a data
    const dataCriacao = new Date(item.data_criacao);
    const formattedDataCriacao = `${dataCriacao.getDate()}/${dataCriacao.getMonth() + 1}/${dataCriacao.getFullYear()}`;
  
    // Definir imagem padrão caso não exista link_img
    const imagemConta = item.link_img 
      ? { uri: item.link_img } 
      : require('../../assets/perfil.png'); // Substitua pelo caminho real da sua imagem padrão
  
    return (
      <View style={styles.contaContainer}>
        <Image source={imagemConta} style={styles.contaImage} />
        <Text style={styles.contaText}>{item.nickname}</Text>
        <Text style={styles.contaText}>{formattedDataCriacao}</Text>
      </View>
    );
  };

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <>
      <NavBar />
      <View style={styles.container}>
        <Image source={{uri: account.profile_picture}} style={styles.avatar} />
        <Text style={styles.name}>{account.first_name} {account.last_name}</Text>
        <Text style={styles.email}>{account.email}</Text>

        {/* Lista de contas */}
        <FlatList
          data={contas}
          renderItem={renderConta}
          keyExtractor={item => item.id.toString()}  // Substitua "id" pela chave primária apropriada do item
          contentContainerStyle={styles.contaList}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginTop: 10
  },
  group: {
    fontSize: 14,
    color: '#333',
    marginTop: 10
  },
  contaList: {
    paddingTop: 20,  // adiciona um espaço acima da lista
  },
  contaContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contaText: {
    fontSize: 18,
  },
  contaImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});