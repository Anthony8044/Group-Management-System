import { GET_ALL_STUDENT_COURSE, GET_ALL_TEACHER_COURSE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getAllStudentCourse = () => async (dispatch) => {

    try {
        const { data } = await api.getAllStudentCourse();

        dispatch({type: GET_ALL_STUDENT_COURSE, payload: data});

    } catch (error) {

        console.log(error);

    }

}

export const getAllTeacherCourse = () => async (dispatch) => {

    try {
        const { data } = await api.getAllTeacherCourse();

        dispatch({type: GET_ALL_TEACHER_COURSE, payload: data});

    } catch (error) {

        console.log(error);

    }

}