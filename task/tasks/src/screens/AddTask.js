import React, { Component } from 'react' //OBS:com hooks é possivel ter estado em componente funcional
import {
    Platform, //criar modo funcione android e ios
    Modal, //tela q aparece..
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native'

import moment from 'moment' //utilizado para validar, manipular e fazer o parse de datas no JavaScript
import DateTimePicker from '@react-native-community/datetimepicker' //componente que fornece acesso à interface do usuário do sistema para seleção de data e hora.

import commonStyles from '../commonStyles'

const initialState = { desc: '', date: new Date(), showDatePicker: false }//inicializando criar tarefa defini atributo descrição tarefa, e data atual,,
                                            /*showDatePicker:dizer se ta aberto ou não o modal da data */
export default class AddTask extends Component {

    state = {//add um estado
        ...initialState //colocando valores estado inicial....
    }

    getDatePicker = () => {//inicia função da data da no task
        let datePicker = <DateTimePicker value={this.state.date} //cria variavel para ser retornado depois
        onChange={(_, date) => this.setState({ date, showDatePicker: false })}//onchange função (atributos _ nao sera usado, data).. state alterar estado data
        mode='date'/>//pega apenas a data não hora nem outros
       
      //  if (this.state.date === undefined) {
     //       this.state.date = initialState.date
      //  }

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')
        //formatar data usando moment acima
        if(Platform.OS === 'Android') {// se plataforma for android
            datePicker = (//seta datePicker
                <View>
                     <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>{/*ao clicar define como verdadeiro */}
                        <Text style={styles.date}>{/*css */}
                            {dateString} {/*feito apartir do moment */}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker} {/*se showDatePicker e datePicker for verdadeiro*/}
                </View>
            )
        }

       return datePicker //retorna variavel datePicker
    }

    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible}/*caso como uma tela aviso.. sera transparente,visibilidade */
            onRequestClose={this.props.onCancel} //requirido para fechar a tela modal
            animationType='slide'>{/*animação de entrada e saida */}
                <TouchableWithoutFeedback //conectado ao outro touch ao clicar fecha modal
                onPress={this.props.onCancel}>{/*apos pressionado botão onCancel fechando aplicação */}
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>              
                <View style={styles.container}>{/*onde sera criada a task nova  */}
                <Text style={styles.header}>Nova Tarefa</Text>
                <TextInput style={styles.input} //inserir texto no aplicativo através de um teclado
                 placeholder="Informe a Descrição..." //escrito no input cinza fraco
                 onChangeText={desc => this.setState({ desc })}//passa texto mais novo nova descrição alterando valor da descrição
                 value={this.state.desc} />{/*valor input sera estado descrição */}
                        {this.getDatePicker()} {/*data atual da task sendo criada */}                      
                        <View style={styles.buttons}>{/*botoes */}
                        <TouchableOpacity onPress={this.props.onCancel}>{/* botão cancelar assim como TouchableWithoutFeedback space */}
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>{/*outro botão salvar */}
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback //conectado ao outro touch ao clicar fecha modal
                onPress={this.props.onCancel}>{/*apos pressionado botão onCancel fechando aplicação */}
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)' //preto com transparencia 0.7 em segundo plano
     },
      container: {
      //      flex: 1, //remove flex 1 para ficar encaixado na hora de digitar a task
          backgroundColor: '#FFF'//tela css criação nota task
      },
    header: {//nova tarefa text
        fontFamily: commonStyles.fontFamily, //letra definida no arquivo
        backgroundColor: commonStyles.colors.today,//today cor vermelha
        color: commonStyles.colors.secondary,//segunda opção de cor amarela
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    input: {//digitavel criar task css
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6
    },
    buttons: {
        flexDirection: 'row', //muda coluna para linha
        justifyContent: 'flex-end' //alinhado direita da tela
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today //cor botoes vermelho
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }

})