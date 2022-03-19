import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api/index.js';

export const getStudents = createAsyncThunk("student/getStudents", async () => {
    const { data } = await api.getStudents('/student/getallstudents');
    return data;
});

export const updateStudent = createAsyncThunk("student/updateStudent", async (studentData) => {
    const id = studentData.user_id;
    const { data } = await api.updateStudent(id, studentData);
    return data;
});

export const deleteStudent = createAsyncThunk("student/deleteStudent", async (id) => {
    const { data } = await api.deleteStudent('/student/getallstudents');
    return id;
});


export const studentSlice = createSlice({
    name: "student",
    initialState: {
        studentsList: [],
        pending: null,
        error: null,
    },
    reducers: {},
    extraReducers: {
        [getStudents.pending]: (state) => {
            state.pending = true;
            state.error = false;
        },
        [getStudents.fulfilled]: (state, action) => {
            state.studentsList = action.payload;
            state.pending = false;
        },
        [getStudents.rejected]: (state) => {
            state.pending = false;
            state.error = true;
        },
        [updateStudent.pending]: (state) => {
            state.pending = true;
            state.error = false;
        },
        [updateStudent.fulfilled]: (state, action) => {
            state.studentsList.map((student) => (student.user_id = action.payload.user_id ? action.payload : student));
            state.pending = false;
        },
        [updateStudent.rejected]: (state) => {
            state.pending = false;
            state.error = true;
        },
        [deleteStudent.pending]: (state) => {
            state.pending = true;
            state.error = false;
        },
        [deleteStudent.fulfilled]: (state, action) => {
            state.studentsList = state.studentsList.filter((student) => student.user_id !== action.payload);
            state.pending = false;
        },
        [deleteStudent.rejected]: (state) => {
            state.pending = false;
            state.error = true;
        },
    },
});

export default studentSlice.reducer;