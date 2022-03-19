import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api/index.js';

export const signin = createAsyncThunk("auth/signin", async (formData) => {
    const { data } = await api.signin(formData);
    return data;
});

export const registerStudent = createAsyncThunk("auth/registerStudent", async (formData) => {
    api.registerStudent(formData);
});

export const registerTeacher = createAsyncThunk("auth/registerTeacher", async (formData) => {
    api.registerTeacher(formData);
});


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        tokens: {},
        pending: null,
        error: null,
    },
    reducers: {
        logout: (authData = [], action) => {
            localStorage.clear();
            return authData = [];
        }
    },
    extraReducers: {
        [signin.pending]: (state) => {
            state.pending = true;
            state.error = false;
        },
        [signin.fulfilled]: (state, action) => {
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            state.tokens = action.payload;
            state.pending = false;
        },
        [signin.rejected]: (state) => {
            state.pending = false;
            state.error = true;
        },
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;