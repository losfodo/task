import React from 'react' //import do react pois possue jsx
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    return ( //retorno do jsx abaixo
        <View style={[styles.container, props.style]}>
            <Icon name={props.icon} size={20} style={styles.icon} //recebe via props..
            />
            <TextInput {...props} style={styles.input} //...props:pega todas as propiedades props acima e passa TextInput para substituir tudo em Auth.js para AuthInput
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        color: '#333',
        marginLeft: 20
    },
    input: {
        marginLeft: 20,
        width: '70%'
    }

})