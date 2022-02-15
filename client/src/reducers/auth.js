import { AUTH, LOGOUT } from '../constants/actionTypes';

const auth = (authData = [], action) => {
    switch(action.type){
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return action.payload;
        case LOGOUT:
            localStorage.clear();
            return authData = [];
        default:
            return authData;
    }
}

export default auth;