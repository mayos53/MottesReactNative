/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/src/App';
import 'react-native-gesture-handler'
import {name as appName} from './app.json';

import { Client } from 'bugsnag-react-native';
const bugsnag = new Client("f94e315352d1efecd660d2a1bc4376ae");

AppRegistry.registerComponent(appName, () => App);
