import {
    GET_MEASUREMENTS,
    GET_MEASUREMENTS_SUCCESS,
    GET_MEASUREMENTS_ERROR,

} from "../Action";

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function unitsReducer(state = initialState, action) {
  switch(action.type) {
    case GET_MEASUREMENTS:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_MEASUREMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data
      };

    case GET_MEASUREMENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
