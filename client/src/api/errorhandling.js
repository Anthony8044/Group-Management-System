

export const errorActionCreator = (errorType, error) => {
    return {
        type: errorType,
        error: true,
        payload: error,
    }
}

export const errorReducer = (state, action) => {
    if (!action.error) {
        return {
            ...state,
            error: null,
            success: action.payload,
        }
    }

    return {
        ...state,
        error: action.payload.response.data.message,
        success: null,
    }
}