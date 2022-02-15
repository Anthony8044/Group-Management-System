import { GET_TEACHER } from '../constants/actionTypes';
import * as api from '../api/index.js';

//Action Creators
export const getTeacher = (user) => async (dispatch) => {

    try {
        const { data } = await api.getTeacher(user);

        dispatch({type: GET_TEACHER, payload: data});

    } catch (error) {

        console.log(error);

    }

}