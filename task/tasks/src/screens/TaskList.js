/*tela principal do projeto task */
import React, { Component } from 'react' //importa react e desestruturar component cria com nome component,componente representa a tela q tem a lista das tarefas
import {//imports gerais para react native
    View,
    Text,
    ImageBackground, //para passar as imagens da task
    StyleSheet, //criar parte do estilo e corrigir a imagem tamanho e proporção
    FlatList, //FlatList exibe uma lista de rolagem de dados que podem ser alterados e que possuem estrutura semelhante. FlatList funciona bem para longas listas de dados, onde o número de itens pode mudar ao longo do tempo.
    TouchableOpacity, //opacidade efeito em clicks
    Platform, //Platform implementar componentes visuais separados para Android e iOS
    Alert //alerta mensagens erro ou avisos
} from 'react-native'

import AsyncStorage from "@react-native-community/async-storage" //sistema de armazenamento de dados sem precisa assim de backend em si e de valor-chave não criptografado, assíncrono, persistente e de valor-chave que é global para o aplicativo
import Icon from 'react-native-vector-icons/FontAwesome' //icones
import axios from 'axios'
import moment from 'moment' //utilizado para validar, manipular e fazer o parse de datas no JavaScript
import 'moment/locale/pt-br' //traduz as datas do moment para portugues

import todayImage from '../../assets/imgs/today.jpg' //ta em screens ..vai para src ..raiz do projeto vai assets, img pastas e acha arquivo imagem
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

import { server, showError } from '../common' //server:const q define qual endereço do servidor ,showError:ver erro
import commonStyles from '../commonStyles'//variação de cores dia mes semana...
import Task from '../components/Task'
import AddTask from './AddTask'

const initialState = {//estado inicial.. com atributos dentro q vira string para setar no AsyncStorage como uma task nova
    showDoneTasks:true, //inicia task como concluida
    showAddTask: false, //aparecer modal de adicionar nova task inicia false
    visibleTasks:[], //se showDoneTasks for true mostra visivel a task se não, nao mostra
    tasks: [] // arrays ou tarefas task
}

export default class TaskList extends Component {//exporta classe  estende component q foi desestruturado
    state = {//criando um estado.. com atributos dentro q vira string para setar no AsyncStorage como uma task nova
        ...initialState //estado inicial..
    }

    componentDidMount = async () => {//metodo ciclo de vida.. async resume melhor para poder chama promise com await
        const stateString = await AsyncStorage.getItem('tasksState') //pega item armazenar nos dados tasksState
        const savedState = JSON.parse(stateString) || initialState //chama json, parse:json virar objeto.. parse pega string ou no estado inicial
        this.setState({
            showDoneTasks: savedState.showDoneTasks //armazenar showDoneTasks no AsyncStorage apenas as outras tasks sera no backend
        }, this.filterTasks)//state:gera o estado aqui.. filterTasks:chama sempre q componente for montado
        //this.filterTasks()//
        this.loadTasks()//chamando a função backend
    }

    loadTasks = async () => {//backend
        try {
            const maxDate = moment()//maxDate:definir a data maxima usando tbm moment
            .add({ days: this.props.daysAhead})//adicionar quantidade de dias usando prosps para conection
            .format('YYYY-MM-DD 23:59:59')//metodo format para filtrar gerar forma q sera a maximo da data de hj
               // .endOf('day').toDate()//paga data do final e converte data
                const res = await axios.get(`${server}/tasks?date=${maxDate}`)//requisição axios interpolando serve pelo caminho url /tasks por data calculada
                this.setState({ tasks: res.data }, this.filterTasks)//passando objeto tasks do banco de dados..filterTasks filtrar tasks
        } catch(e) {
            showError(e)
        }
    }

    toggleFilter = () => {//sempre q chama metodo
        this.setState({ showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)//pega estado atual !this.state.showDoneTasks com negação logica e setar no showDoneTasks
    }

    filterTasks = () => {//metodo função filtrar tasks concluidas ou ocultalas
        let visibleTasks = null //inicia nulo visibilidade da task
        if(this.state.showDoneTasks) {//se se estado mostra task é verdadeiro
            visibleTasks = [...this.state.tasks]// clona o array criando novo
        } else {//se for falso
            const pending = task => task.doneAt === null //função se for pendente ou doneAt nulo
            visibleTasks = this.state.tasks.filter(pending)// filtra apenas as tasks pendentes
        }

        this.setState({ visibleTasks }) //setando no final o clone array task
        AsyncStorage.setItem('tasksState', JSON.stringify({//armazenar no AsyncStorage apenas as tasks finalizadas
            showDoneTasks: this.state.showDoneTasks
        }))//JSON.stringify metodo converte valores em javascript para uma String  JSON para armazenar dados tasks
    }

    toggleTask = async taskId => {//toggleTask recebe id, conectado a TouchableWithoutFeedback em task.js.. alternancia da task para backend se concluida ou não
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)//interpolando para backend
            this.loadTasks()//atualiza
        } catch(e) {
            showError(e)
        }

        //   const tasks = [...this.state.tasks]//cria uma constante com array
      //  tasks.forEach(task => {//forEach()= permite executar uma função para cada item de um array.
     //       if(task.id === taskId) { //se id for realmente igual taskid
      //          task.doneAt = task.doneAt ? null : new Date()//alterna se tiver task feita setada a data done vou limpar ou coloca uma data nova
     //       }
     //   })

      //  this.setState({ tasks }, this.filterTasks) //passando novo objeto array como tasks.. depois atualizado estado filtrar as tasks concluidas apos clicar nelas tbm e não só no icone visor
    }

    addTask = async newTask => { //metodo addTask recebe nova task
        if(!newTask.desc || !newTask.desc.trim()) {//se não informou descrição valida ou vazio. trim:se descrição tiver apenas espaços vazios 
            Alert.alert('Dados Inválidos', 'Descrição não informada!')//aviso de invalido
            return //retorna garantindo q n vai ficar execuntado
        }

        try {
            await axios.post(`${server}/tasks`, {//inserir uma nova tarefa por backend
               desc: newTask.desc,
               estimateAt: newTask.date 
            })

            this.setState({ /*tasks,*/ showAddTask: false }, this.loadTasks)//estado alterando task + modal ele é removido, e atualiza task por backend
        } catch(e) {
            showError(e)
        }

       // const tasks = [...this.state.tasks] //gerar clone da task
       // tasks.push({//gerando clone com push
      //      id: Math.random(),//id unico aleatorio
      //      desc: newTask.desc,//descrição
      //      estimateAt: newTask.date,//data
      //      doneAt: null//dados de conclusão inicia nulo..
      //  })

    }

    deleteTask = async taskId => {// deletar a task metodo recebe id..
        try {
            await axios.delete(`${server}/tasks/${taskId}`)//backend conectando para deletar
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
        //   const tasks = this.state.tasks.filter(task => task.id !== id)//task filtra todas q são diferente do id deletado
       // this.setState({ tasks }, this.filterTasks) //array tasks filtra task apos removido
    }

    getImage = () => {//switch das imagens caso q retornando dependendo de qual dia for
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () => {//para a cor agora
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    render() {//cria render...
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')//coloca moment em ação dia atual(ddd:seg ter quar,D:dia,[string],MMMM:mes ano)
        return (//render q retorna os jsx...
      
            <View style={styles.container}>{/*colocando para retornar proporção de tela em css */}
                <AddTask isVisible={this.state.showAddTask} /*mostrar o modal transparencia escura adicionar task */ 
                onCancel={() => this.setState({ showAddTask: false })}//coloca botão fechar modal false removendo
                onSave={this.addTask} //vincula newTask
                />
                <ImageBackground source={this.getImage()}//imagem de fundo colocada 
                style={styles.background}>{/*proporçoes de tela tbm flex 1 */}
                <View style={styles.iconBar}>{/*onde sera botão.. */}
                <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}//função q abre a barra de hj semana mes...
                >
                        <Icon name='bars'//icone de barra
                           size={20} color={commonStyles.colors.secondary} />
                </TouchableOpacity>
                    <TouchableOpacity onPress={this.toggleFilter}>
                        <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} /*eye icone:sempre q mostra concluidas,eye-slash:olho cortado nao concluida,,Obs:sempre q ler estado state direto, alterando setState */
                        size={20} color={commonStyles.colors.secondary}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>{/*conteudo no final coluna area onde possui a imagem */}
                    <Text style={styles.title}>{this.props.title}</Text>{/*titulo encaminhado por props a navigator.js */}
                    <Text style={styles.subtitle}>{today}</Text>{/*const today moment com data */}
                </View>
                </ImageBackground>
                <View style={styles.taskList}>{/*ocupa 70% espaço referenciado */}
                <FlatList data={this.state.visibleTasks} //FlatList exibe uma lista de rolagem de dados criando assim o scrool de rolagem
                keyExtractor={item => `${item.id}`}/*defini uma função q sera responsavel por definir cada um dos itens */
                renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>}/>{/*renderizar q recebe uma função e pega objetos ...item de array state de toggleTask, this puxa atributo de forEach.. deletar task de vez  */}
                </View>
                <TouchableOpacity style={[styles.addButton,
                { backgroundColor: this.getColor()}]} //cores do + icone
                    activeOpacity={0.7} //ajusta opacidade na hora do click não ser tão branco
                    onPress={() => this.setState({ showAddTask: true })}>{/*acionar o click showAddTask: true OBS:no states inicia false */}
                    <Icon name="plus" size={20}// icone de +
                        color={commonStyles.colors.secondary} />{/*cor secundaria icone */}
                </TouchableOpacity>
            </View>//text simples com view apenas para mostrar
        )
    }
}

const styles = StyleSheet.create({//com StyleSheet importado arrumando proporçoes da imagem para tela
    container: {
        flex: 1 //tamanho padrão proporçoes dos tamanhos geral
    },
    background: {
        flex: 3 //30 porcento da tela ocupada a ImageBackground
    },
    taskList: {
        flex: 7 //70% da tela ocupada pelo view espaço
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end' //conteudo no final da coluna cima para baixo por q é react native
    },
    title: {//estilo css titulos
        fontFamily: commonStyles.fontFamily,//caminho arquivo..
        color: commonStyles.colors.secondary, //cor da letra branca
        fontSize: 50,//tamanho da letra
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: { // css horario
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {// botão de filtras as tarefas olho q fica no topo icone
        flexDirection: 'row', //eixo da linha 
        marginHorizontal: 20, // locomovel um pouco para esquerda
        justifyContent: 'space-between', //alinha a barra e olho separadamente deixando barra lado esquerdo
        marginTop: Platform.OS === 'ios' ? 40 : 10 //usando plataform para ios e android locomoção de cada um
    },
    addButton: { //botão icone + add tasks
        position: 'absolute', //sera absoluto na tela passando por cima de tasks e pagina o que for
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,//arredondado bolinha..
       // backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',//centralizar o icone no centro da bolinha
        alignItems: 'center'
    }
});