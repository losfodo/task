import React from 'react'  /*sera componente de classe e não de estado */
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback //não apresenta nenhum feedback visual, portanto não use a menos que tenha uma boa razão. Já que todos os elementos filhos que respondem ao toque devem receber um feedback visual quando tocados.
 //   TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome' //importa um icone

import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? //se foi concluido a task com doneAt ou diferente de nulo
     { textDecorationLine: 'line-through' } : {} //risca o objetivo concluido.. ou vazio não{}
    
     const date = props.doneAt ? props.doneAt : props.estimateAt //date recebe task estiver concluida retorna na data em si ou nadata q esta estimada para não concluida
     const formattedDate = moment(props.estimateAt).locale('pt-br')//colocar moment para data ficar em portugues
     .format('ddd, D [de] MMMM')//passando formatação da data

    return (
        <View style={styles.container}>{/*divisoes das task css container */}
            <TouchableWithoutFeedback //acionar todas as funcoes da task filhos gerando alteração no onpress abaixo
            onPress={() => props.toggleTask(props.id)}>{/*onPress: manipulção de toques botoes.. cria função toggleTask com id */}
            <View style={styles.checkContainer}>
                {getCheckView(props.doneAt)}{/*conclução task ou não */}
            </View>
            </TouchableWithoutFeedback>
            <View>
                <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>{/*descrição */}
                <Text style={styles.date}>{formattedDate}</Text>{/*data estimada.. data formatada */}

            </View>
        </View>
    )
}

function getCheckView(doneAt) { //check de task concluida ou não
    if(doneAt != null) {//se a data esta diferente de nulo
        return (//retorna tarefa concluida
            <View style={styles.done}>
                <Icon name='check' size={20} color='#FFF'></Icon>{/*icone de check de task concluida */}
            </View>
        )
    } else {//se não a tarefa esta pendente
        return (
            <View style={styles.pending}></View>
        )
    }
   
    }


const styles = StyleSheet.create({//StyleSheet em react native é objeto q é uma abstração semelhante ao CSS StyleSheets
    container: {
        flexDirection: 'row',//padrão em reactNative é por coluna colocando direção para linha agr
        borderColor: '#AAA',//cor borda
        borderBottomWidth: 1,//largura da borda divisoes
        alignItems: 'center',//deixar centralizado
        paddingVertical: 10,//espaçamento de cima para baixo
        backgroundColor: '#FFF'
    },
    checkContainer: {//espaçamento extra na task
        width: '20%',
        alignItems: 'center',//alinhar bolinha de pendente task no centro
        justifyContent: 'center'
    },
    pending: {//fica pendente
        height: 25,
        width: 25,
        borderRadius: 13,//circunferencia arredondada
        borderWidth: 1,
        borderColor: '#555' //cor mais preto tranparente bolinha
    },
    done: {//css task concluida
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center', //alinhar o icone com a bolinha
        justifyContent: 'center'
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,//cor mais fraca subText
        fontSize: 12
    }

})

