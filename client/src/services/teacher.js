import { api } from "./api"


export const teacherApi = api.injectEndpoints({
    endpoints: (build) => ({
        getTeachers: build.query({
            query: (body) => {
                return {
                    url: "/teacher/getallteachers",
                    body,
                }
            },
            providesTags: ['Teacher'],
        }),
        getTeacher: build.query({
            query: (id) => {
                return {
                    url: `/teacher/getteacher/${id}`,
                }
            },
            providesTags: ['Teacher'],
        }),
        updateTeacher: build.mutation({
            query: (teacherData) => {
                return {
                    url: `/teacher/updateteacher/${teacherData.user_id}`,
                    method: "PATCH",
                    body: teacherData,
                }
            },
            invalidatesTags: ['Teacher'],
        }),
    }),
})

export const { useGetTeachersQuery, useGetTeacherQuery, useUpdateTeacherMutation } = teacherApi