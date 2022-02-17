import { GET_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from '../constants/actionTypes';
import * as api from '../api/index.js';

//Action Creators

export const getStudents = () => async (dispatch) => {

    try {
        const { data } = await api.getStudents();

        dispatch({type: GET_STUDENT, payload: data});

    } catch (error) {

        console.log(error);

    }

}

export const updateStudent = (id, user) => async (dispatch) => {

    try {
        const { data } = await api.updateStudent(id, user);

        dispatch({type: UPDATE_STUDENT, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const deleteStudent = (id) => async (dispatch) => {
    try {
        await api.deleteStudent(id);

        dispatch({ type: DELETE_STUDENT, payload: id});
    } catch (error) {
        console.log(error);
    }
}