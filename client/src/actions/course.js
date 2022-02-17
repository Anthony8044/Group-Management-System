import { REGISTER_COURSE, GET_COURSES } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const registerCourse = (user) => async (dispatch) => {

    try {
        const { data } = await api.registerCourse(user);

        dispatch({type: REGISTER_COURSE, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const getAllCourses = () => async (dispatch) => {

    try {
        const { data } = await api.getAllCourses();

        dispatch({type: GET_COURSES, payload: data});

    } catch (error) {

        console.log(error);

    }

}

// export const getAllStudentCourse = () => async (dispatch) => {

//     try {
//         const { data } = await api.getAllStudentCourse();

//         dispatch({type: GET_ALL_STUDENT_COURSE, payload: data});

//     } catch (error) {

//         console.log(error);

//     }

// }

// export const getAllTeacherCourse = () => async (dispatch) => {

//     try {
//         const { data } = await api.getAllTeacherCourse();

//         dispatch({type: GET_ALL_TEACHER_COURSE, payload: data});

//     } catch (error) {

//         console.log(error);

//     }

// }