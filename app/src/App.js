import React from 'react';
import AppNavigator from './AppNavigator';
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import {combineReducers, createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import unitsReducer from './components/redux/units/UnitsReducer';
import loginReducer from './components/redux/login/LoginReducer';
import measurementsReducer from './components/redux/measurements/MeasurementsReducer';





const reducers = combineReducers({login:loginReducer,
                                  units:unitsReducer,
                                  measurements:measurementsReducer});
const store = createStore(reducers, applyMiddleware(thunk));


export default class App extends React.Component {
  render() {

    console.disableYellowBox = true;
    return(
      <Provider store={ store }>
          <AppNavigator/>
        </Provider>
    )
  }
}
AppRegistry.registerComponent('App', () => App);
