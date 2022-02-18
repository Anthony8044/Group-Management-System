import { GET_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from '../constants/actionTypes';


const userReducers = (students = [], action) => {
    switch(action.type){
        case DELETE_STUDENT:
            return students.filter((student) => student.user_id !== action.payload);
        case UPDATE_STUDENT:
            return students.map((student) => (student.user_id = action.payload.user_id ? action.payload :student));
            //return [...student, action.payload ];
        case GET_STUDENT:
            return action.payload;
        // case CREATE_USER:
        //     return [...students, action.payload ];
        default:
            return students;
    }
}

export default userReducers;