import {
    ACTION_LOGIN,
    ACTION_LOGIN_SUCCESS,
    ACTION_LOGIN_ERROR
} from "../Action";
import {getToken} from "../../utils/Store";



initialState = {}


export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_LOGIN:
            return {
                ...state,
                token: null,
                error: null
            };
        case ACTION_LOGIN_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
        case ACTION_LOGIN_SUCCESS:
            return {
                    ...state,
                    token: action.payload.token,
                    error: null
                };
        default:
            return state;
    }
};
