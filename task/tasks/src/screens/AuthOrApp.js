import React, { Component } from 'react' //hooks possue acesso estado metodos ciclo de vida
import {
    View,
    ActivityIndicator, //Exibe um indicador de carregamento circular.,, saber se entrar em tela authentificação ou tela de tasks ja logado
    StyleSheet
} from 'react-native'

import axios from 'axios'//Axios é um cliente HTTP baseado em Promises para fazer requisições.
import AsyncStorage from '@react-native-community/async-storage'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const userDataJson = await AsyncStorage.getItem('userData') //usa await para acionar AsyncStorage tela quando estiver pronto
        let userData = null
        
        try {
            userData = JSON.parse(userDataJson)//json userData setando
        } catch(e) {
            // userData está inválido
        }

        if(userData && userData.token) {//se userdata e toker setados
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`//Authorization recebe token
            this.props.navigation.navigate('Home', userData)//mantem para tela home mesmo sendo atualizada o celular, tendo q sair apenas com logout..
        } else {
            this.props.navigation.navigate('Auth')//se não para auth,, mantem auth caso atualizado
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, //para crescer na tela
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})