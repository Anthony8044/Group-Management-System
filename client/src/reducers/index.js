import { combineReducers } from "redux";
import student from './student';
import teacher from './teacher';
import auth from './auth';
import { getAllStudentCourse, getAllTeacherCourse  } from './course';


export default combineReducers({ student, teacher, auth, getAllStudentCourse, getAllTeacherCourse })