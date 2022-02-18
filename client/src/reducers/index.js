import { combineReducers } from "redux";
import students from './students';
import teachers from './teachers';
import auth from './auth';
import courses from './courses';
import errors from './errors';


export default combineReducers({ students, teachers, auth, courses, errors })