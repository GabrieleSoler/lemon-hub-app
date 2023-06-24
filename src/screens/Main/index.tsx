import { Text, View, StyleSheet, Image, ScrollView, TextInput, FlatList , Modal, Alert , TouchableOpacity, ActivityIndicator  } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import api from "../../service/api";
import { Picker } from '@react-native-picker/picker';
import Message from "../../components/Mensagem";
import { useNavigation } from "@react-navigation/core";
import NavBar from "../../components/Navbar/index";

import ModalDropdown from 'react-native-modal-dropdown';

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
  const [loading, setLoading] = useState<any>(true);
  const [perguntas, setPerguntas] = useState<any>([]);
  const [respostas, setRespostas] = useState<any>({});
  const [contas, setContas] = useState<Conta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAnswerModalVisible, setAnswerModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [respostasPadrao, setRespostasPadrao] = useState<any>([]);
  const [selectedDefaultAnswer, setSelectedDefaultAnswer] = useState('Selecione uma resposta');


  useEffect (() => {
    fetchRespostasPadrao();
    fetchContas();
  }, []);

  const fetchRespostasPadrao = async () => {
    setLoading(true);
    try {
        const response = await api.get('/meli/respostas-padrao/');
        setRespostasPadrao(response.data.results);
    } catch (error) {
      console.error(error);
    }  finally {
      setLoading(false);
    }
  };

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

  const handleAnswerChange = (text: any, pergunta: any) => {
    setRespostas(prevState => ({ ...prevState, [pergunta.id]: { text: text, question: pergunta } }));
  }

  const handleAnswerPress = (pergunta: any) => {
    const conversasAnteriores = pergunta.conversas_anteriores ? [...pergunta.conversas_anteriores].reverse() : [];
  
    const perguntaInvertida = {
      ...pergunta,
      conversas_anteriores: conversasAnteriores
    };
  
    setCurrentQuestion(perguntaInvertida);
    setSelectedDefaultAnswer('Selecione uma resposta');
    setAnswerModalVisible(true);
  };
  
  const handleAnswerSubmit = (perguntaId: any) => {
    console.log(perguntaId)
    if (!perguntaId) {
      
      Alert("A sua resposta esta vazia");
      return;
    }
    const answer = respostas[perguntaId];
    const accountId = selectedAccount;

  
    let obj = {
      question_id: answer.question.id,
      text: answer.text
    }
  
    const submitAnswer = async () => {
      try {
        const response = await api.post(`/meli/pergunta/responder/${accountId}/`, obj);

        setPerguntas(prevPerguntas => prevPerguntas.filter((pergunta) => pergunta.id !== perguntaId));
  
        setRespostas(prevRespostas => {
          const newRespostas = {...prevRespostas};
          delete newRespostas[perguntaId];
          return newRespostas;
        });
  
      } catch (error) {
        console.error(error);
      } finally {
        setAnswerModalVisible(false);
      };
    }
    submitAnswer();
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const handleValueChange = async (itemValue: any, page: number) => {
    setSelectedAccount(itemValue);
    setPerguntas([]);
    setLoading(true);
    const selectedAcc = contas.find((conta) => conta.id === Number(itemValue));

    const limit = 5;
    const offset = (page - 1) * limit;
    const filtros = {
      status: "UNANSWERED",
      offset: offset,
      sort_fields: "date_created",
      sort_types: "DESC",
    };

    const perguntasList = await api.post(`/meli/perguntas2/${selectedAcc?.id}/?limit=${limit}`, filtros).then(
      (response) => {
        setPerguntas(response.data.questions);
        setTotalPages(Math.ceil(response.data.total / limit));
        setCurrentPage(page);
      }
    ).catch(
      (erro) => {
        console.log("Deu esse erro: ", erro);
      }
    ).finally(() => {
      setLoading(false);
    });
  }

    return (
      <>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isAnswerModalVisible}
            onRequestClose={() => {
              setAnswerModalVisible(!isAnswerModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => {
                  setAnswerModalVisible(false);
                  setSelectedDefaultAnswer('');
                }}>
                  <Icon name="close" size={30} color="#000" />
                </TouchableOpacity>

            <View style={styles.conversationsContainer}>
                {Array.isArray(currentQuestion?.conversas_anteriores) && currentQuestion.conversas_anteriores.length > 0 ? (
                  <FlatList
                    data={currentQuestion.conversas_anteriores}
                    renderItem={({item}) => (
                      <View>
                        <Message message={item.text} isSeller={false} />
                        {item.answer && <Message message={item.answer.text} isSeller={true} />}
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    inverted
                  />
                ) : (
                  <Text style={styles.questionText}>{currentQuestion?.text}</Text>
                )}
              </View>
                  <ModalDropdown
                    options={respostasPadrao}
                    renderRow={(option) => (
                      <Text style={styles.dropdownText}>{option.nome}</Text>
                    )}
                    renderButtonText={(option) => option.nome}
                    onSelect={(index, value) => {
                      setSelectedDefaultAnswer(value.nome);
                      handleAnswerChange(value.texto, currentQuestion); 
                    }}
                    style={styles.dropdown}
                    dropdownStyle={styles.dropdownStyle} 
                    defaultValue={selectedDefaultAnswer}
                  />

                <TextInput
                multiline={true}
                  style={styles.input}
                  onChangeText={(text) => handleAnswerChange(text, currentQuestion)}
                  value={respostas[currentQuestion?.id]?.text || ''}
                  placeholder="Digite sua resposta aqui"
                />
                <TouchableOpacity style={styles.button} onPress={() => handleAnswerSubmit(currentQuestion.id)}>
                  <Text style={styles.buttonText}>Enviar Resposta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

         <NavBar></NavBar>

      <ScrollView style={styles.mainContainer}>
      {contas && (
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

        {loading ?
                <></>
              :
              perguntas.map((pergunta) => (
                <View key={pergunta.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    <Image source={{ uri: pergunta.link_img }} style={styles.cardImage} />
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardTitle}>{pergunta.titulo_anuncio}</Text>
                      <Text style={styles.cardQuestion}>{pergunta.text}</Text>
                      <Text style={styles.cardDate}>{formatDate(pergunta.date_created)}</Text>
                    </View>
                  </View>

                  {pergunta.status === 'UNANSWERED' ? (
                    <TouchableOpacity style={styles.button} onPress={() => handleAnswerPress(pergunta)}>
                      <Text style={styles.buttonText}>Responder</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text>Caso seja respondida</Text>
                  )}
                </View>
              ))
            }


        {loading ?
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
            :

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

        }
        
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
  cardQuestion: {
    marginBottom: 5,
  },
  cardDetails: {
    flex: 1,
  }, 
   cardDate: {
    color: 'gray',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 15
  },
  cardTitle: {
    fontSize: 13,
    color: "#367CFF",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 0,
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
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    marginBottom: 150,
    marginTop: 100,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPage: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 20,
    width: '45%',
    alignItems: 'center',
    marginBottom: 20
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
},
dropdown: {
  marginTop: 5,
  width: '100%',
  marginBottom: 20,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 10,
  padding: 10,


},

dropdownStyle: {
  width: '100%',
},
questionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
  textAlign: "center",
},

questionText: {
  fontSize: 20,
  marginBottom: 20,
  fontWeight: "bold",
  textAlign: "left",
},
conversationsContainer: {
  maxHeight: "70%"
  
},
scrollConverasAnteriores: {
  flex: 1,
},
dropdownText: {
  fontSize: 18,
  margin: 10,
},
spinnerContainer: {
  marginTop: 125,
  justifyContent: 'center',
  alignItems: 'center',
}

});
