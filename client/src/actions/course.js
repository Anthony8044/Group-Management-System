import * as api from '../api/index.js';
import { GET_COURSES } from '../constants/actionTypes';
import { ERROR_REQUEST, ERROR_SUCCESS, ERROR_FAIL } from '../constants/actionTypes';
import { errorActionCreator } from '../api/errorhandling';


export const createCourse = (course) => async (dispatch) => {
    dispatch({ type: ERROR_REQUEST });

    try {
        const { data } = await api.createCourse(course);

        dispatch({ type: ERROR_SUCCESS, payload: data.message });

    } catch (error) {
        //dispatch(errorActionCreator(ERROR_FAIL, error));
    }

}

export const registerCourse = (user) => async (dispatch) => {

    dispatch({ type: ERROR_REQUEST });
    try {
        const { data } = await api.registerCourse(user);
        dispatch({ type: ERROR_SUCCESS, payload: data.message });

    } catch (error) {
        //dispatch(errorActionCreator(ERROR_FAIL, error));
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