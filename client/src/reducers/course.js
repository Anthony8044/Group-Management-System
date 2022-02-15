import { GET_ALL_STUDENT_COURSE, GET_ALL_TEACHER_COURSE } from '../constants/actionTypes';

export const getAllStudentCourse = (courses = [], action) => {
    switch (action.type) {
        case GET_ALL_STUDENT_COURSE:
            //return users.map((user) => (user._id = action.payload._id ? action.payload :user));
            return action.payload;
        default:
            return courses;
    }
}

export const getAllTeacherCourse = (courses = [], action) => {
    switch (action.type) {
        case GET_ALL_TEACHER_COURSE:
            //return users.map((user) => (user._id = action.payload._id ? action.payload :user));
            return action.payload;
        default:
            return courses;
    }
}