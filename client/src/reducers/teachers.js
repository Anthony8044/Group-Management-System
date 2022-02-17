import { GET_TEACHER, UPDATE_TEACHER } from '../constants/actionTypes';

const userReducers = (teachers = [], action) => {
    switch(action.type){
        case UPDATE_TEACHER:
            return teachers.map((teacher) => (teacher.user_id = action.payload.user_id ? action.payload :teacher));
            //return [...student, action.payload ];
        case GET_TEACHER:
            return action.payload;
        default:
            return teachers;
    }
}

export default userReducers;