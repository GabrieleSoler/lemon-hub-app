import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { useEffect, useState } from "react";
import api from "../../service/api";
import { Picker } from '@react-native-picker/picker';



interface Conta {
  id: number;
  nickname: string;
  user: number;
  seller_id: number;
  data_criacao: string;
  link_img: string | null;
  permalink: string;
  nivel: string | null;
}

export default function Main() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState();


  useEffect (() => {
    console.log("Carregou");
    const fetchContas = async () => {
      try {

          const response = await api.get('/meli/contas/');
          setContas(response.data.results);
          console.log(response.data);

      } catch (error) {
        console.error(error);
        // Exibir mensagem de erro
      } finally {
        setLoading(false);
      }
    };

    fetchContas();

  }, []);

  const handleValueChange = (itemValue: any) => {
    setSelectedAccount(itemValue);
    const selectedAcc = contas.find((conta) => conta.id === itemValue);
    console.log(selectedAcc);
  }

    return ( 
      <ScrollView style={styles.mainContainer}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Lemon</Text>
        <Ionicons style={styles.icons} name="ios-notifications" size={30} color="black" />
        <Image source={require('../../assets/avatar.jpg')} style={styles.avatar} />
      </View>

      {!loading && contas && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAccount}
            onValueChange={handleValueChange}
          >
            {contas.map((conta, index) => (
              <Picker.Item label={conta.nickname} value={conta.id} key={index} />
            ))}
          </Picker>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
  pickerContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // Adicione um valor aqui que seja adequado para você
  },
});
