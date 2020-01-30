import 'react-native-gesture-handler'

import {
      createStackNavigator,
      createAppContainer
    } from 'react-navigation';
import Login from './components/screens/Login';
import Home from './components/screens/Home';
import Measurements from './components/screens/Measurements';



import {
  AppRegistry
} from 'react-native';


const RootStack = createStackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  Measurements: { screen: Measurements }


});
const AppNavigator = createAppContainer(RootStack);



export default AppNavigator;
