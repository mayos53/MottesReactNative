import {
    GET_UNITS,
    GET_UNITS_SUCCESS,
    GET_UNITS_ERROR,

} from "../Action";

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function unitsReducer(state = initialState, action) {
  switch(action.type) {
    case GET_UNITS:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_UNITS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.units
      };

    case GET_UNITS_ERROR:
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
