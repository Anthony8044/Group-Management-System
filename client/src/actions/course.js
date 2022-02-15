import { GET_ALL_USER_COURSE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getAllCourseUsers = () => async (dispatch) => {

    try {
        const { data } = await api.getAllCourseUsers();

        dispatch({type: GET_ALL_USER_COURSE, payload: data});

    } catch (error) {

        console.log(error);

    }

}