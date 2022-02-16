import axios from 'axios';
import decode from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'http://localhost:5000';
const API = axios.create({ baseURL });

API.interceptors.request.use( async (req) => {
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

    const response = await axios.post(`${baseURL}/auth/refreshToken`, {tok: userToken?.refreshToken});
    console.log(response);
    localStorage.setItem('profile', JSON.stringify(response.data));
    req.headers.Authorization = `Bearer ${response.data.token}`;
  }
  return req;
});

//Auth
export const signin = (formData) => API.post('/auth/login', formData);
export const registerStudent = (formData) => API.post('/auth/registerStudent', formData);
export const registerTeacher = (formData) => API.post('/auth/registerTeacher', formData);

//Student
export const getStudent = (userId) => API.post('/student/getstudent', userId);
export const updateStudent = (id, updatedUser) => API.patch(`/student/updatestudent/${id}`, updatedUser);

//Teacher
export const getTeacher = (userId) => API.post('/teacher/getteacher', userId);
export const updateTeacher = (id, updatedUser) => API.patch(`/teacher/updateteacher/${id}`, updatedUser);

//Course
export const createUsers = (newUser) => API.post('/course/registerCourse', newUser);
export const getAllStudentCourse = () => API.get('/course/getAllStudentCourse');
export const getAllTeacherCourse = () => API.get('/course/getAllTeacherCourse');


export const deleteUser = (id) => API.delete(`users/${id}`);

// export const signin = (formData) => API.post('/users/signin', formData);
// export const signup = (formData) => API.post('/users/signup', formData);




