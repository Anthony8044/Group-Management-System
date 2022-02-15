import { GET_ALL_USER_COURSE } from '../constants/actionTypes';

export const allCourseUsers = (courses = [], action) => {
    switch (action.type) {
        case GET_ALL_USER_COURSE:
            //return users.map((user) => (user._id = action.payload._id ? action.payload :user));
            return action.payload;
        default:
            return courses;
    }
}