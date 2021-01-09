import { Alert, Platform } from 'react-native'//conectando com o backend da aplicação

const server = Platform.OS === 'ios'//se for ios url localhost:3000 se não android http://10.0.2.2:3000
? 'http://localhost:3000' : 'http://10.0.2.2:3000'

function showError(err) {//showerror encaminhados para os erros em si
    if(err.response && err.response.data) {//função caso de erro
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.response.data}`)
    } else {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`)
    }
}

function showSuccess(msg) {//se der sucesso
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSuccess }