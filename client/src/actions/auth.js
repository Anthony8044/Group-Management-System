import { AUTH, REGISTER_STUDENT, REGSITER_TEACHER } from '../constants/actionTypes';
import * as api from '../api/index.js';

// export const signin = (formData, navigate) => async (dispatch) => {
//     try {
//         const { data } = await api.signin(formData);

//         dispatch({ type: AUTH, payload: data });

//         navigate('/');
//         window.location.reload();
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const registerStudent = (formData, history) => async (dispatch) => {
//     try {
//         const { data } = await api.registerStudent(formData);

//         //dispatch({ type: REGISTER_STUDENT, payload: data });

//         history('/login')
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const registerTeacher = (formData, history) => async (dispatch) => {
//     try {
//         const { data } = await api.registerTeacher(formData);

//         //dispatch({ type: REGSITER_TEACHER, payload: data });

//         history('/login')
//     } catch (error) {
//         console.log(error);
//     }
// }