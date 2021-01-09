import React, { Component } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
  //  TextInput,//inserir texto no aplicativo através de um teclado
    TouchableOpacity,
    Alert
 // Platform
} from 'react-native'

import axios from 'axios'//Axios é um cliente HTTP baseado em Promises para fazer requisições.
import AsyncStorage from '@react-native-community/async-storage'//sistema de armazenamento de dados de chave e valor com backend 

import backgroundImage from '../../assets/imgs/login.jpg' //imagem do login do app
import commonStyles from '../commonStyles'
import AuthInput from '../components/Authinput'

import { server, showError, showSuccess } from '../common'

const initialState = {//dados do formulario..
    name: '',
    email: '',
    password: '',
    confirmPassword: '',//confirmação da senha
    stageNew: false //se estou em estado criação ou estado de login
}

export default class Auth extends Component {

    state = {//estado inicial
        ...initialState
    }

    signinOrSignup = () => {//se esta tentando um signin criar conta ou Signup entra na tasks
        if(this.state.stageNew) {//se tiver stageNew..
            this.signup()//sucesso ao criar a conta
        } else {//senão sera sucesso ao logar sua conta
            this.signin()
        }
    }

    signup = async () => {//função async para await.. signup: cadastro do usuario
        try {
            await axios.post(`${server}/signup`, {//fazer conecção com backend server, e passando as informações abaixo
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            showSuccess('Usuário cadastro!')//usuario cadastrado com sucesso
            this.setState({...initialState })//stageNew voltar para tela de login pois ja foi cadastrado..
        } catch(e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {//chama usando axios com metodo post server backend e url signin
                email: this.state.email,//dados para passar login e entrar na task com signin
                password: this.state.password
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))//quando logado usuario sera inserido no AsyncStorage por email e token atraves res.data
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}` //setando em Authorization o token
            this.props.navigation.navigate('Home', res.data)//passando tag q quer navegar home,res.data:ter acesso valores email nome do usuario logado
        } catch(e) {
            showError(e)
        }
    }

    render() {
        const validations = []//criando validaçoes inicia vazio..
        validations.push(this.state.email && this.state.email.includes('@'))//primeira validação:email tem q ter um @
        validations.push(this.state.password && this.state.password.length >= 6)//a senha tem q ser maior ou igual a 6
       
        if(this.state.stageNew) {//estando em um novo usuario para criar stageNew
            validations.push(this.state.name && this.state.name.trim().length >= 3)//nome não pode ser vazio e tem q ser maior ou igual a 3 letras
            validations.push(this.state.password === this.state.confirmPassword)//senha ser exatamente igual a senha e confirmação de senha
        }

        const validForm = validations.reduce((t, a) => t && a)//(total, valor atual)total tem q ser igual ao atual de todos,,,saber se tem formulario valido ou não
       // reduce:  “reduz” os itens de um vetor a um valor único.
        return (
            <ImageBackground source={backgroundImage} //coloca a imagem do login
            style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                <Text style={styles.subtitle}//subtitulo com state.stageNew caso criar conta ou entrar
                >
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew && //se stageNew for verdadeiro.. ou seja estiver em cadastrar novo usuario
                        <AuthInput icon='user' placeholder="Nome" value={this.state.name}//se estiver em estado de criação de novo usuario
                    style={styles.input} onChangeText={name => this.setState({name})}
                    />
                    }
                    <AuthInput icon='at' placeholder="E-mail" value={this.state.email}//email,,, colocando icon e conectando com authinput.js por props
                    style={styles.input} onChangeText={email => this.setState({email})} //se inscrever nos eventos onChangeText para ler a entrada do usuário email
                    />
                    <AuthInput icon='lock' placeholder="Senha" value={this.state.password}//senha
                    style={styles.input} secureTextEntry={true}//secureTextEntry para não ficar visivel digitação senha
                    onChangeText={password => this.setState({password})} //se inscrever nos eventos onChangeText para ler a entrada do usuário email
                    />
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk' placeholder="Confirmação de Senha" value={this.state.confirmPassword}//comfirmação de senha
                    style={styles.input} secureTextEntry={true}//secureTextEntry para não ficar visivel digitação senha
                    onChangeText={confirmPassword => this.setState({confirmPassword})} //se inscrever nos eventos onChangeText para ler a entrada do usuário email
                    />
                    }
                    <TouchableOpacity onPress={this.signinOrSignup}//onde ficara botão de entrar ou registra o login
                    disabled={!validForm}//disabilita se não tiver o formulario valido de registrar ou logar
                    >
                    <View style={[styles.button, // stageNew registrar se true e entrar se false
                    validForm ? {} : { backgroundColor: '#AAA' }]} //se for valido {}mantem como esta botão verde: ao desabilitado alguma validação cor fica cinza
                    >
                            <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Registrar' : 'Entrar'} 
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }}//colocando css diretamento coloca duas chaves{{}},,onde ficara alternancia botão criação de usuario e botão login
                onPress={() => this.setState({ stageNew: !this.state.stageNew })}//negando o stageNew para alternar de false para true com text perguntado se quer fazer conta click de botão
                >
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({// css
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,//cor da letra branca
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10 //distancia abaixo um pouco mais
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',       
        padding: 20,//espaçamento entre email e senha
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
      //  padding: Platform.OS =='ios' ? 15 : 10 //caso seja ios padding aumenta para 30 se não mantem padrão 0
    },
    button: {
        backgroundColor: '#080',//cor botão verde
        marginTop: 10,//espaçamento entre botão e digito senha
        padding: 10,//aumenta um pouco o botão
        alignItems: 'center',
        borderRadius: 7 //arredonda as bordas
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily, //font:lato 
        color: '#FFF',//letras botão branco
        fontSize: 20 //tamanho da letra
    }
})