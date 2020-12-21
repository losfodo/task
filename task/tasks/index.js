/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TaskList from './src/screens/TaskList';//substituir app padrão reactNative por TaskList.. fazendo caminho arquivo
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TaskList);//troca app.js para TaskList como pagina principal
