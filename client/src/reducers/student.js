import { GET_STUDENT, CREATE_USER, UPDATE, DELETE } from '../constants/actionTypes';

const userReducers = (student = [], action) => {
    switch(action.type){
        case DELETE:
            return student.filter((user) => user._id !== action.payload);
        case UPDATE:
            //return student.map((user) => (user._id = action.payload._id ? action.payload :user));
            return [...student, action.payload ];
        case GET_STUDENT:
            return [...student, action.payload ];
        case CREATE_USER:
            return [...student, action.payload ];
        default:
            return student;
    }
}

export default userReducers;