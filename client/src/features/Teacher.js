import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api/index.js';

export const getTeachers = createAsyncThunk("teacher/getTeachers", async () => {
    const { data } = await api.getTeachers();
    return data;
});

export const updateTeacher = createAsyncThunk("teacher/updateTeacher", async (teacherData) => {
    const id = teacherData.user_id;
    const { data } = await api.updateTeacher(id, teacherData);
    return data;
});


export const teacherSlice = createSlice({
    name: "teacher",
    initialState: {
        teachersList: [],
        pending: null,
        error: null,
    },
    reducers: {},
    extraReducers: {
        [getTeachers.pending]: (state) => {
            state.pending = true;
            state.error = false;
        },
        [getTeachers.fulfilled]: (state, action) => {
            state.teachersList = action.payload;
            state.pending = false;
        },
        [getTeachers.rejected]: (state) => {
            state.pending = false;
            state.error = true;
        },
        [updateTeacher.pending]: (state) => {
            state.pending = true;
            state.error = false;
        },
        [updateTeacher.fulfilled]: (state, action) => {
            state.teachersList = state.teachersList.map((teacher) => (teacher.user_id = action.payload.user_id ? action.payload : teacher));
            state.pending = false;
        },
        [updateTeacher.rejected]: (state) => {
            state.pending = false;
            state.error = true;
        }
    },
});

export default teacherSlice.reducer;