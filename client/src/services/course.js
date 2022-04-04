import { api } from "./api"


export const courseApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllCourses: build.query({
            query: () => {
                return {
                    url: "/course/getAllCourses",
                }
            },
            providesTags: ['Course'],
        }),
        getCourse: build.query({
            query: (id) => {
                return {
                    url: `/course/getCourse/${id}`,
                }
            },
            providesTags: ['Course'],
        }),
        getCourseFull: build.query({
            query: (id) => {
                return {
                    url: `/course/getCourseFull/${id}`,
                }
            },
            providesTags: ['Course'],
        }),
        createCourse: build.mutation({
            query: (body) => {
                return {
                    url: "/course/createcourse",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Course'],
        }),
        registerCourse: build.mutation({
            query: (body) => {
                return {
                    url: "/course/registercourse",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Course'],
        }),
    }),
})

export const { useGetAllCoursesQuery, useCreateCourseMutation, useRegisterCourseMutation, useGetCourseQuery, useGetCourseFullQuery } = courseApi