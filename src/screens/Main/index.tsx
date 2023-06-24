import { Text, View, StyleSheet, Image, ScrollView, TextInput, Button, Modal, TouchableHighlight, TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { useEffect, useState } from "react";
import api from "../../service/api";
import { Picker } from '@react-native-picker/picker';
import Message from "../../components/Mensagem";
import { useNavigation } from "@react-navigation/core";
import NavBar from "../../components/Navbar/index";
import DropDownPicker from 'react-native-dropdown-picker';



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
  const [respostasPadrao, setRespostasPadrao] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<any[]>([]);
  const navigation = useNavigation();


  useEffect (() => {
    fetchRespostasPadrao();
    fetchContas();
  }, []);


  const fetchContas = async () => {
    setLoading(true);
    try {
        const response = await api.get('/meli/contas-perguntas/');
        setContas(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRespostasPadrao = async () => {
    const response = await api.get('/meli/respostas-padrao/');
    setRespostasPadrao(response.data.results);
  };

  const handleAnswerChange = (respostaPadraoId: any, pergunta: any) => {
    const respostaPadrao = respostasPadrao.find((resposta) => resposta.id === respostaPadraoId);
    const text = respostaPadrao ? respostaPadrao.texto : '';
    setRespostas(prevState => ({ ...prevState, [pergunta.id]: { text: text, question: pergunta, respostaPadraoId: respostaPadraoId } }));
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

      
         <NavBar></NavBar>

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
                <Picker
                    selectedValue={respostas[pergunta.id]?.respostaPadraoId || ''}
                    onValueChange={(itemValue) => handleAnswerChange(itemValue, pergunta)}
                  >
                    {respostasPadrao.map((respostaPadrao, index) => (
                      <Picker.Item label={respostaPadrao.nome} value={respostaPadrao.id} key={index} />
                    ))}
                  </Picker>
              <TouchableOpacity style={styles.button} onPress={() => handleAnswerSubmit(pergunta.id)}>
                  <Text style={styles.buttonText}>Responder</Text>
              </TouchableOpacity>
            </>
          ) : (

            <Text>Caso seja respondida</Text>

          )}



        </View>
      ))}


        <View style={styles.buttonContainer}>
          {currentPage > 1 && (
            <TouchableOpacity style={styles.buttonPage} onPress={() => {
              if (currentPage > 1) {
                handleValueChange(selectedAccount, currentPage - 1);
              }
            }}>
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          {currentPage < totalPages && (
            <TouchableOpacity style={styles.buttonPage} onPress={() => {
              if (currentPage < totalPages) {
                handleValueChange(selectedAccount, currentPage + 1);
              }
            }}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          )}
        </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8'
  },
  pickerContainer: {
    alignSelf: 'stretch',
    color: 'blue',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, 
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset:{
        width: 3,
        height: 3
    }
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 15
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset:{
        width: 1,
        height: 1
    },
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  centeredView: {
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonPage: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 20,
    width: '45%',
    alignItems: 'center',
    marginBottom: 20
  }
});
