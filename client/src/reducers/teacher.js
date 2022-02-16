import { GET_TEACHER, UPDATE_TEACHER } from '../constants/actionTypes';

const userReducers = (teacher = [], action) => {
    switch(action.type){
        case GET_TEACHER:
            return [...teacher, action.payload ];
        case UPDATE_TEACHER:
            return [...teacher, action.payload ];
        default:
            return teacher;
    }
}

export default userReducers;