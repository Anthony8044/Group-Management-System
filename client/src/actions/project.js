import * as api from '../api/index.js';
import { GET_PROJECTS } from '../constants/actionTypes';
import { ERROR_REQUEST, ERROR_SUCCESS, ERROR_FAIL } from '../constants/actionTypes';
import { errorActionCreator } from '../api/errorhandling';


export const createproject = (project) => async (dispatch) => {
    dispatch({ type: ERROR_REQUEST });

    try {
        const { data } = await api.createproject(project);

        //dispatch({ type: ERROR_SUCCESS, payload: data.message });

    } catch (error) {
        console.log(error);
        //dispatch(errorActionCreator(ERROR_FAIL, error));
    }

}

export const getAllProjects = () => async (dispatch) => {

    try {
        const { data } = await api.getAllProjects();

        dispatch({ type: GET_PROJECTS, payload: data });

    } catch (error) {

        console.log(error);

    }

}