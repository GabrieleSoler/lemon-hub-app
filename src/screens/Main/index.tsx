import { Text, View, StyleSheet, Image, ScrollView, TextInput, Button, Modal, TouchableHighlight } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { useEffect, useState } from "react";
import api from "../../service/api";
import { Picker } from '@react-native-picker/picker';
import Message from "../../components/Mensagem";
import { useNavigation } from "@react-navigation/core";


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
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<any[]>([]);
  const navigation = useNavigation();



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

  const handleAnswerChange = (text: any, pergunta: any) => {
    setRespostas(prevState => ({ ...prevState, [pergunta.id]: { text: text, question: pergunta } }));
  }
  
  const handleAnswerSubmit = (perguntaId: any) => {
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
    submitAnswer();
  }

  const handleValueChange = (itemValue: any, page: number) => {
    setSelectedAccount(itemValue);
    setPerguntas([]); // Limpe o estado das perguntas
    const selectedAcc = contas.find((conta) => conta.id === Number(itemValue));

    const limit = 5;
    const offset = (page - 1) * limit;
    const filtros = {
      status: "UNANSWERED",
      offset: offset
    };

    const perguntasList = api.post(`/meli/perguntas2/${selectedAcc?.id}/?limit=${limit}`, filtros).then(
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

  const handleConversasAnteriores = (pergunta: any) => {
    setSelectedConversations(pergunta.conversas_anteriores);
    setModalVisible(true);
  };


    return (
      <>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>
                {selectedConversations.map((conversa, index) => (
                  <View key={index}>
                    <Message message={conversa.text} isSeller={false} />
                    {conversa.answer && <Message message={conversa.answer.text} isSeller={true} />}
                  </View>
                ))}
              </ScrollView>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!isModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Fechar Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>


      
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Lemon</Text>
        <Ionicons style={styles.icons} onPress={() => { navigation.navigate('Notification') }} name="ios-notifications" size={30} color="black" />
        <Image source={require('../../assets/avatar.jpg')} style={styles.avatar} />
      </View>
      <ScrollView style={styles.mainContainer}>
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

          {pergunta.conversas_anteriores && (
              <Button title="Conversas Anteriores" onPress={() => handleConversasAnteriores(pergunta)} />
          )}

          
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

            <Text>Caso seja respondida</Text>

          )}



        </View>
      ))}


        {currentPage > 1 && (  // Mostrar o botão "Anterior" somente se a página atual for maior que 1
            <Button 
              title="Anterior"
              onPress={() => {
                if (currentPage > 1) {
                  handleValueChange(selectedAccount, currentPage - 1);
                }
              }}
            />
          )}

          {currentPage < totalPages && (  // Mostrar o botão "Próximo" somente se a página atual for menor que o total de páginas
            <Button 
              title="Próximo"
              onPress={() => {
                if (currentPage < totalPages) {
                  handleValueChange(selectedAccount, currentPage + 1);
                }
              }}
            />
          )}
    </ScrollView>
    </>
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
  },centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
