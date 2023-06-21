import { Text, View, StyleSheet, Image, ScrollView, TextInput, Button } from "react-native";
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
  unanswered_questions: number;
}

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [contas, setContas] = useState<Conta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect (() => {
    const fetchContas = async () => {
      try {
          const response = await api.get('/meli/contas-perguntas/');
          setContas(response.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchContas();
  }, []);

  const handleAnswerChange = (text, pergunta) => {
    setRespostas(prevState => ({ ...prevState, [pergunta.id]: { text: text, question: pergunta } }));
  }
  
  const handleAnswerSubmit = (perguntaId) => {
    const answer = respostas[perguntaId];
    const accountId = selectedAccount;
  
    let obj = {
      question_id: answer.question.id,
      text: answer.text
    }
  
    // Criar uma nova função assíncrona para tratar a resposta
    const submitAnswer = async () => {
      try {
        const response = await api.post(`/meli/pergunta/responder/${accountId}/`, obj);
  
        // Remove a pergunta respondida da lista de perguntas
        setPerguntas(prevPerguntas => prevPerguntas.filter((pergunta) => pergunta.id !== perguntaId));
  
        // Remove a resposta do estado
        setRespostas(prevRespostas => {
          const newRespostas = {...prevRespostas};
          delete newRespostas[perguntaId];
          return newRespostas;
        });
  
      } catch (error) {
        console.error(error);
      }
    }
  
    // Chamar a função assíncrona
    submitAnswer();

  
    console.log(obj, accountId);
  }

  const handleValueChange = (itemValue: any, page: number) => {
    setSelectedAccount(itemValue);
    const selectedAcc = contas.find((conta) => conta.id === Number(itemValue));
    console.log(selectedAcc);

    const limit = 5;
    const offset = (page - 1) * limit;
    const filtros = {
      status: "UNANSWERED",
      limit: limit,
      offset: offset
    };

    const perguntasList = api.post(`/meli/perguntas2/${selectedAcc?.id}/`, filtros).then(
      (response) => {
        setPerguntas(response.data.questions);
        setTotalPages(Math.ceil(response.data.total / limit));
        setCurrentPage(page);
      }
    ).catch(
      (erro) => {
        console.log("Deu esse erro: ", erro);
      }
    );
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
        <View>
          <Picker
            selectedValue={selectedAccount}
            onValueChange={handleValueChange}
          >
            {contas.map((conta, index) => (
              <Picker.Item label={conta.nickname + " - " + conta.unanswered_questions} value={conta.id} key={index} />
            ))}
          </Picker>
        </View>
      )}

      {perguntas.map((pergunta) => (
        <View key={pergunta.id} style={styles.card}>
          <Image source={{ uri: pergunta.link_img }} style={styles.cardImage} />
          <Text>{pergunta.text}</Text>

          
          {pergunta.status === 'UNANSWERED' ? (
            <>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleAnswerChange(text, pergunta)}
                value={respostas[pergunta.id]?.text || ''}
                placeholder="Digite sua resposta aqui"
              />
              <Button title="Responder" onPress={() => handleAnswerSubmit(pergunta.id)} />
            </>
          ) : (

            <Text>Aqui vai dar bom</Text>

          )}

        </View>
      ))}

      <Button 
              title="Anterior"
              onPress={() => {
                if (currentPage > 1) {
                  handleValueChange(selectedAccount, currentPage - 1);
                }
              }}
            />
            <Button 
              title="Próximo"
              onPress={() => {
                if (currentPage < totalPages) {
                  handleValueChange(selectedAccount, currentPage + 1);
                }
              }}
            />
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
  pickerContainer: {
    alignSelf: 'stretch',
    color: 'blue',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // Adicione um valor aqui que seja adequado para você
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    margin: 20,
    padding: 5,
    width:'90%',
    shadowColor: "#000",
    shadowOpacity:0.2,
    shadowRadius:1,
    shadowOffset:{
        width:3,
        height:3
    }
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover'
  }
});
