import { FETCH_ALL_USERS, CREATE_USER, UPDATE, DELETE } from '../constants/actionTypes';

const userReducers = (users = [], action) => {
    switch(action.type){
        case DELETE:
            return users.filter((user) => user._id !== action.payload);
        case UPDATE:
            return users.map((user) => (user._id = action.payload._id ? action.payload :user));
        case FETCH_ALL_USERS:
            return action.payload;
        case CREATE_USER:
            return [...users, action.payload ];
        default:
            return users;
    }
}

export default userReducers;