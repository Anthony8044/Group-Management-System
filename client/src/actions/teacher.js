import { GET_TEACHER, UPDATE_TEACHER } from '../constants/actionTypes';
import * as api from '../api/index.js';

//Action Creators
export const getTeachers = () => async (dispatch) => {

    try {
        const { data } = await api.getTeachers();
        dispatch({ type: GET_TEACHER, payload: data });

    } catch (error) {
        console.log(error);
    }

}

export const updateTeacher = (id, user) => async (dispatch) => {
    //dispatch({ type: ERROR_REQUEST });

    try {
        const { data } = await api.updateTeacher(id, user);
        dispatch({ type: UPDATE_TEACHER, payload: data });
    } catch (error) {
        //console.log(error);
        //dispatch(errorActionCreator(ERROR_FAIL, error));

    }
}