import { errorReducer } from "../api/errorhandling";
import { ERROR_REQUEST, ERROR_SUCCESS, ERROR_FAIL, ERROR_CLEAR } from '../constants/actionTypes';

const initState = {
    isLoading: false,
    error: null,
    success: null
}


const userReducers = (state = initState, action) => {
    switch (action.type) {
        case ERROR_REQUEST:
            return {
                ...errorReducer(state, action),
                isLoading: true,
                success: null,
            }
        case ERROR_SUCCESS:
            return {
                ...errorReducer(state, action),
                isLoading: false,
            }
        case ERROR_FAIL:
            return {
                ...errorReducer(state, action),
                isLoading: false,
            }
        case ERROR_CLEAR:
            return {
                isLoading: false,
                error: null,
                success: null
            }

        default:
            return state;
    }
}

export default userReducers;