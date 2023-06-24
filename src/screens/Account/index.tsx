import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
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
        <View style={styles.contaInfo}>
          <Text style={styles.contaNickname}>{item.nickname}</Text>
          <Text style={styles.contaData}>{formattedDataCriacao}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return  <ActivityIndicator size="large" color="#0000ff" style={styles.spinnerContainer}/>

  }

  return (
    <>
      <NavBar />
      <View style={styles.container}>
        <Text style={styles.name}>{account.first_name} {account.last_name}</Text>
        <Text style={styles.email}>{account.email}</Text>

        <Text style={styles.heading}>Contas Conectadas</Text>

        <FlatList
          data={contas}
          renderItem={renderConta}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.contaList}
          style={styles.flatlist}
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  contaList: {
    paddingTop: 20,
  },
  contaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contaInfo: {
    flex: 1,
    marginLeft: 10,
  },
  contaNickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contaData: {
    fontSize: 16,
  },
  contaImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  flatlist: {
    width: "100%",
  },
  spinnerContainer: {
    marginTop: 125,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
