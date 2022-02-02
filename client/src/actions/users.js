import { FETCH_ALL_USERS, CREATE_USER, UPDATE, DELETE } from '../constants/actionTypes';
import * as api from '../api/index.js';

// Action Creators
export const getUsers = () => async (dispatch) => {

    try {
        const { data } = await api.fetchUsers();

        dispatch({type: FETCH_ALL_USERS, payload: data});

    } catch (error) {

        console.log(error);

    }

}

export const createUsers = (user) => async (dispatch) => {

    try {
        const { data } = await api.createUsers(user);

        dispatch({type: CREATE_USER, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = (id, user) => async (dispatch) => {

    try {
        const { data } = await api.updateUser(id, user);

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