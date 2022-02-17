import { GET_STUDENT, UPDATE, DELETE } from '../constants/actionTypes';
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

        dispatch({type: UPDATE, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = (id) => async (dispatch) => {
    try {
        await api.deleteUser(id);

        dispatch({ type: DELETE, payload: id});
    } catch (error) {
        console.log(error);
    }
}