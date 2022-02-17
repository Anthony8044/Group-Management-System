import { REGISTER_COURSE, GET_COURSES } from '../constants/actionTypes';
import * as api from '../api/index.js';


export const createCourse = (course) => async (dispatch) => {

    try {
        const { data } = await api.createCourse(course);

        //dispatch({type: CREATE_COURSE, payload: data});

    } catch (error) {

        console.log(error);

    }

}

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