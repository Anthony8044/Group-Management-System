import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });

export const fetchUsers = () => API.get('/users');
export const createUsers = (newUser) => API.post('/users', newUser);
export const updateUser = (id, updatedUser) => API.patch(`/users/${id}`, updatedUser);
export const deleteUser = (id) => API.delete(`users/${id}`);

// export const signin = (formData) => API.post('/users/signin', formData);
// export const signup = (formData) => API.post('/users/signup', formData);

export const signin = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/register', formData);


