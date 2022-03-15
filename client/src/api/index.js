import axios from 'axios';
import decode from 'jwt-decode';
import dayjs from 'dayjs';
import { store } from '../index';
import { errorActionCreator } from '../api/errorhandling';


const baseURL = 'http://localhost:5000';
const API = axios.create({ baseURL });

API.interceptors.request.use(async (req) => {
  let userToken = '';
  if (localStorage.getItem('profile')) {
    userToken = JSON.parse(localStorage.getItem('profile'));
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  //const userToken = JSON.parse(localStorage.getItem('profile')?.token);
  if (userToken) {
    const user = decode(userToken?.token);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) return req

    const response = await axios.post(`${baseURL}/auth/refreshToken`, { tok: userToken?.refreshToken });
    //console.log(response);
    localStorage.setItem('profile', JSON.stringify(response.data));
    req.headers.Authorization = `Bearer ${response.data.token}`;
  }
  return req;
});

API.interceptors.response.use(
  response => response,
  error => {
    store.dispatch(errorActionCreator("ERROR_FAIL", error));
  });

//Auth
export const signin = (formData) => API.post('/auth/login', formData);
export const registerStudent = (formData) => API.post('/auth/registerStudent', formData);
export const registerTeacher = (formData) => API.post('/auth/registerTeacher', formData);

//Student
export const getStudents = () => API.get('/student/getallstudents');
export const updateStudent = (id, updatedUser) => API.patch(`/student/updatestudent/${id}`, updatedUser);

//Teacher
export const getTeachers = () => API.get('/teacher/getallteachers');
export const updateTeacher = (id, updatedUser) => API.patch(`/teacher/updateteacher/${id}`, updatedUser);

//Course
export const createCourse = (formData) => API.post('/course/createCourse', formData);
export const registerCourse = (formData) => API.post('/course/registerCourse', formData);
export const getAllCourses = () => API.get('/course/getAllCourses');

//Course
export const createproject = (formData) => API.post('/project/createproject', formData);
export const getAllProjects = () => API.get('/project/getAllProjects');


export const deleteStudent = (id) => API.delete(`users/${id}`);





