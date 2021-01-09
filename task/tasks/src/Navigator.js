import React from 'react' //não possue jsx não necessario react,,,React Navigation é uma biblioteca popular para roteamento e navegação em uma aplicação React Native. Essa biblioteca ajuda a resolver o problema de navegar entre várias telas e compartilhar dados entre elas.
import { createAppContainer, createSwitchNavigator } from 'react-navigation' //createSwitchNavigator:navegar de uma tela para outra.. esse é o tipo mais simples
//createAppContainer:configurações para o roteamento funcionar independente do tipo da rota que estivemos utilizando
import { createDrawerNavigator } from 'react-navigation-drawer'

import Auth from './screens/Auth'
import TaskList from './screens/TaskList'

import AuthOrApp from './screens/AuthOrApp'
import Menu from './screens/Menu'
import commonStyles from './commonStyles'

const menuConfig = {//configuraçoes para ter drawer personalizado
    initialRouteName: 'Today', //rota inicial
    contentComponent: Menu,//componete com conteudo menu.js com DrawerItems
    contentOptions: {//opçoes relacionadas ao conteudo do drawer
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080',//verde
            fontWeight: 'bold',//peso da fonte
        }
    }
}

const menuRoutes = {//rotas de hj amanhã, semana, meses
    Today: {
        name: 'Today',
        screen: props => <TaskList title='Hoje' daysAhead={0} {...props} />,//titulo, daysAhead:dias a frente
        navigationOptions: {//titulo q aparece no menu
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <TaskList title='Amanhã' daysAhead={1} {...props} />,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <TaskList title='Semana' daysAhead={7} {...props} />,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <TaskList title='Mês' daysAhead={30} {...props} />,
        navigationOptions: {
            title: 'Mês'
        }
    },
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)//menu de navegação q sera a tela home.. menu config passado para funcionar no codigo

const mainRoutes = {//rotas principais
     AuthOrApp: { //definir se vamos entrar em authentificação ou em home
         name: 'AuthOrApp',
         screen: AuthOrApp
     },
    Auth: {//tela authentificação login
        name: 'Auth',
        screen: Auth //componene importado arquivo
    },
    Home: {//home seria a de tasks em si
        name: 'Home',
        screen: menuNavigator //menu de navegação puxando tela para lado
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {//criando o navegador
    initialRouteName: 'AuthOrApp' //rota inicial Auth de login para saber se entrar em tela authentificação ou tela de aplicação
})
export default createAppContainer(mainNavigator) //exporta por padrão