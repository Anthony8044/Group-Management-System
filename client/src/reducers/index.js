import { combineReducers } from "redux";
import student from './student';
import auth from './auth';
import { allCourseUsers } from './course';


export default combineReducers({ student, auth, allCourseUsers })