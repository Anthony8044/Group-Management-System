import { GET_COURSES } from '../constants/actionTypes';
import * as api from '../api/index.js';


export const createCourse = (course) => async (dispatch) => {
    dispatch({ type: "ERROR_MESSAGE_REQUEST" });

    try {
        const { data } = await api.createCourse(course);

        dispatch({ type: "ERROR_MESSAGE_SUCESS", payload: data });

    } catch (error) {
        dispatch({ type: "ERROR_MESSAGE_FAIL", error: error.response.data.message });

    }

}

export const registerCourse = (user) => async (dispatch) => {
    dispatch({ type: "ERROR_MESSAGE_REQUEST" });

    try {
        const { data } = await api.registerCourse(user);
        dispatch({ type: "ERROR_MESSAGE_SUCESS", payload: data });

        //dispatch({type: REGISTER_COURSE, payload: data })
    } catch (error) {
        dispatch({ type: "ERROR_MESSAGE_FAIL", error: error.response.data.message });
    }
}

export const getAllCourses = () => async (dispatch) => {

    try {
        const { data } = await api.getAllCourses();

        dispatch({ type: GET_COURSES, payload: data });

    } catch (error) {

        console.log(error);

    }

}