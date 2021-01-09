/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Navigator from './src/Navigator';//substituir app padrão reactNative por TaskList e vira auth e agr Navigator.. fazendo caminho arquivo
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Navigator);//troca app.js para TaskList como pagina principal para Auth tela de login ou authentificação inicial a navigator
