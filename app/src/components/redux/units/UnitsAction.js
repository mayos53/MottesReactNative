import {GET_UNITS, GET_UNITS_SUCCESS, GET_UNITS_ERROR} from "../Action";
import {saveToken,getToken} from "../../utils/Store";
import {RNFetchBlob} from "rn-fetch-blob"
import base64 from 'react-native-base64'




export function getUnits() {
  return (dispatch) => {
    dispatch(getUnitsBegin());
    getToken().then((token)=> {
        var headers = new Headers();
        console.log("TOKEN "+token)
        headers.append("Authorization", "Basic " + token);
        fetch("http://www.tensiograph.com/webservice/api.php?json",
              {headers:headers})
          .then(handleErrors)
          .then(res => res.json())
          .then(json => {
            dispatch(getUnitsSuccess(json));
            return json;
          })
          .catch(error => dispatch(getUnitsFailure(error)));

        });
  }
}


export const getUnitsBegin = () => {
  console.log("getUnitsBegin")
  return {
    type: GET_UNITS
  }
};

export const getUnitsSuccess = (units) => {
  console.log("getUnitsSuccess")
  return {
    type: GET_UNITS_SUCCESS,
    payload: { units }
  }
};

export const getUnitsFailure = error => {
  console.log("getUnitsFailure")
  saveToken(null)
  return {
    type: GET_UNITS_ERROR,
    payload: { error }
  }
};

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
