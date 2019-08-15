import {ACTION_LOGIN, ACTION_LOGIN_SUCCESS, ACTION_LOGIN_ERROR} from "../Action";
import {saveToken,getToken} from "../../utils/Store";
import base64 from 'react-native-base64'




export function login(user, password) {
  return (dispatch) => {
    dispatch(loginBegin());
    var headers = new Headers();
    token = base64.encode(user+":"+password)
    console.log("TOKEN "+token)
    headers.append("Authorization", "Basic " + token);
    fetch("http://www.tensiograph.com/webservice/api.php?json",
          {headers:headers})
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(loginSuccess(token));
        return json;
      })
      .catch(error => dispatch(loginFailure(error)));


  }
}

export function checkSession(token) {
  return (dispatch) => {
    dispatch(loginBegin());
    console.log("TOKEN "+token)
    var headers = new Headers();
    headers.append("Authorization", "Basic " + token);
    fetch("http://www.tensiograph.com/webservice/api.php?json",
          {headers:headers})
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(loginSuccess(token));
        return json;
      })
      .catch(error => dispatch(loginFailure(error)));


  }
}


export const loginBegin = () => {
  console.log("login")
  return {
    type: ACTION_LOGIN
  }
};

export const loginSuccess = (token) => {
  console.log("loginSuccess")
  saveToken(token)
  return {
    type: ACTION_LOGIN_SUCCESS,
    payload: { token }
  }
};

export const loginFailure = error => {
  console.log("loginFailure")
  saveToken(null)
  return {
    type: ACTION_LOGIN_ERROR,
    payload: { error }
  }
};

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok ) {
    throw Error(response.statusText);
  }
  return response;
}
