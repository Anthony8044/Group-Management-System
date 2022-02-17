import { REGISTER_COURSE, GET_COURSES } from '../constants/actionTypes';

// export const getAllStudentCourse = (courses = [], action) => {
//     switch (action.type) {
//         case GET_ALL_STUDENT_COURSE:
//             //return users.map((user) => (user._id = action.payload._id ? action.payload :user));
//             return action.payload;
//         default:
//             return courses;
//     }
// }

// export const getAllTeacherCourse = (courses = [], action) => {
//     switch (action.type) {
//         case GET_ALL_TEACHER_COURSE:
//             //return users.map((user) => (user._id = action.payload._id ? action.payload :user));
//             return action.payload;
//         default:
//             return courses;
//     }
// }

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