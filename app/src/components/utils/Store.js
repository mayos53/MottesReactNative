import {
    AsyncStorage
} from 'react-native';

const KEY_TOKEN = 'access_token';


export const saveToken = (token) => {
  if(token != null){
    AsyncStorage.setItem(KEY_TOKEN, token)
  }else{
    AsyncStorage.removeItem(KEY_TOKEN)
  }
}


export const getToken = () => {
    return AsyncStorage.getItem(KEY_TOKEN);
};
