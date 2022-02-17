import { GET_STUDENT, CREATE_USER, UPDATE, DELETE } from '../constants/actionTypes';

const userReducers = (students = [], action) => {
    switch(action.type){
        case DELETE:
            return students.filter((student) => student.user_id !== action.payload);
        case UPDATE:
            return students.map((student) => (student.user_id = action.payload.user_id ? action.payload :student));
            //return [...student, action.payload ];
        case GET_STUDENT:
            return action.payload;
        case CREATE_USER:
            return [...students, action.payload ];
        default:
            return students;
    }
}

export default userReducers;