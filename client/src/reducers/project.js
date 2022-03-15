import { GET_PROJECTS } from '../constants/actionTypes';

const userReducers = (projects = [], action) => {
    switch(action.type){
        case GET_PROJECTS:
            return action.payload;
        default:
            return projects;
    }
}

export default userReducers;