import {GET_MEASUREMENTS, GET_MEASUREMENTS_SUCCESS, GET_MEASUREMENTS_ERROR} from "../Action";

import {saveToken,getToken} from "../../utils/Store";
import base64 from 'react-native-base64'
import moment from 'moment';




Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function getMeasurements(unitId, nbDays) {
  const date = new Date();
  const startDate = moment(date).add(-nbDays, 'day').format("YYYY-MM-DD")

  return (dispatch) => {
    dispatch(getMeasurementsBegin());
    getToken().then((token)=> {
        var headers = new Headers();
        console.log("TOKEN "+token)
        headers.append("Authorization", "Basic " + token);
        fetch("https://www.tensiograph.com/webservice/api.php?json&unit="+unitId+"&from="+startDate,//2&from=2019-07-10&to=2019-07-12",
              {headers:headers})
          .then(handleErrors)
          .then(res => res.json())
          .then(json => {
            dispatch(getMeasurementsSuccess(json));
            return json;
          })
          .catch(error => dispatch(getMeasurementsFailure(error)));

        });
  }
}


export const getMeasurementsBegin = () => {
  console.log("getMeasurementsBegin")
  return {
    type: GET_MEASUREMENTS
  }
};

export const getMeasurementsSuccess = (data) => {
  console.log("getMeasurementsSuccess")
  return {
    type: GET_MEASUREMENTS_SUCCESS,
    payload: { data }
  }
};

export const getMeasurementsFailure = error => {
  console.log("getMeasurementsFailure")
  saveToken(null)
  return {
    type: GET_MEASUREMENTS_ERROR,
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
