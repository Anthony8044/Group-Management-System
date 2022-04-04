import { api } from "./api"


export const studentsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getStudents: build.query({
            query: () => {
                return {
                    url: "/student/getallstudents",
                }
            },
            providesTags: ['Student'],
        }),
        getStudent: build.query({
            query: (id) => {
                return {
                    url: `/student/getstudent/${id}`,
                }
            },
            providesTags: ['Student'],
        }),
        getSectionStudents: build.query({
            query: (id) => {
                return {
                    url: `/student/getSectionStudents/${id}`,
                }
            },
            providesTags: ['Student'],
        }),
        updateStudent: build.mutation({
            query: (studentData) => {
                return {
                    url: `/student/updatestudent/${studentData.user_id}`,
                    method: "PATCH",
                    body: studentData,
                }
            },
            invalidatesTags: ['Student'],
        }),
    }),
})

export const { useGetStudentsQuery, useGetStudentQuery, useUpdateStudentMutation, useGetSectionStudentsQuery } = studentsApi