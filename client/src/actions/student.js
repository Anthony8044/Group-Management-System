import { GET_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from '../constants/actionTypes';
import { ERROR_REQUEST, ERROR_SUCCESS, ERROR_FAIL } from '../constants/actionTypes';
import { errorActionCreator } from '../api/errorhandling';
import * as api from '../api/index.js';

//Action Creators

// export const getStudents = () => async (dispatch) => {

//     try {
//         const { data } = await api.getStudents();
//         dispatch({ type: GET_STUDENT, payload: data });

//     } catch (error) {
//         console.log(error);
//     }

// }

// export const updateStudent = (id, user) => async (dispatch) => {
//     //dispatch({ type: ERROR_REQUEST });

//     try {
//         const { data } = await api.updateStudent(id, user);
//         dispatch({ type: UPDATE_STUDENT, payload: data });
//     } catch (error) {
//         //console.log(error);
//         //dispatch(errorActionCreator(ERROR_FAIL, error));

//     }
// }

// export const deleteStudent = (id) => async (dispatch) => {
//     try {
//         await api.deleteStudent(id);

//         dispatch({ type: DELETE_STUDENT, payload: id });
//     } catch (error) {
//         console.log(error);
//     }
// }