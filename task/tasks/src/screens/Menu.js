import React from 'react'
import { Platform, ScrollView, //ScrollView: barra de rolagem p react native
    View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'//item de ação com um ícone e um rótulo em uma gaveta de navegação.
import { Gravatar } from 'react-native-gravatar' //dados com nome e email com icon de foto q coloca avatar q costuma ficar no topo
import commonStyles from '../commonStyles'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {

    const logout = () => {//metoda de sair da tasks
        delete axios.defaults.headers.common['Authorization']//deletando Authorization
        AsyncStorage.removeItem('userData')//remove AsyncStorage
        props.navigation.navigate('AuthOrApp')//se vai para Auth login ou app tasks
    }

    return (
        <ScrollView>
            <View style={styles.header}>
            <Text style={styles.title}>Tasks</Text>
        <Gravatar style={styles.avatar}//icon bolinha azul de avatar
        options={{//coloca objeto diretamente..
            email: props.navigation.getParam('email'),
            secure: true
        }}/>
        <View style={styles.userInfo} //nomes e email no topo do drawer navigator de opçoes ...
        >
            <Text style={styles.name}>
               {props.navigation.getParam('name')}
            </Text>
            <Text style={styles.email}>
               {props.navigation.getParam('email')}
            </Text>
        </View>
        <TouchableOpacity onPress={logout} //logout sair da tasks
        >
                    <View style={styles.logoutIcon}>
                        <Icon name='sign-out' size={30} color='#800' />
                    </View>
        </TouchableOpacity>
            </View>
            <DrawerItems {...props} //props para receber tudo de DrawerItems
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title: {
        color: '#000',//preto
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        paddingTop: Platform.OS === 'ios' ? 70 : 30,
        padding: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,//marginTop: Platform.OS === 'ios' ? 30: 10 //
        backgroundColor: '#222'
    },
    userInfo: {
        marginLeft: 10,
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.mainText,
        marginBottom: 5,
    },
    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 10,
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10
    }

})
