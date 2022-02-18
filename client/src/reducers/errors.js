
const initState = {
    items: [],
    loading: false,
    error: null
}

const userReducers = (state = initState, action) => {
    switch (action.type) {
        case "ERROR_MESSAGE_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            }
        case "ERROR_MESSAGE_SUCESS":
            return {
                ...state,
                loading: false,
                items: action.payload,
            }
        case "ERROR_MESSAGE_FAIL":
            return {
                ...state,
                loading: false,
                error: action.error,
            }
        case "ERROR_CLEAR":
            return {
                ...state,
                items: [],
                loading: false,
                error: null,
            }

        default:
            return state;
    }
}

export default userReducers;