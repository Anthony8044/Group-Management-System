import { REGISTER_COURSE, GET_COURSES } from '../constants/actionTypes';

const userReducers = (courses = [], action) => {
    switch(action.type){
        case REGISTER_COURSE:
            return [...courses, action.payload ];
        case GET_COURSES:
            return action.payload;
        default:
            return courses;
    }
}

export default userReducers;