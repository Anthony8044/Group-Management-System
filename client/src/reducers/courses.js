import { GET_COURSES } from '../constants/actionTypes';

const userReducers = (courses = [], action) => {
    switch(action.type){
        case GET_COURSES:
            return action.payload;
        default:
            return courses;
    }
}

export default userReducers;