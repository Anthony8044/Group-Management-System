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

export const { useGetAllCoursesQuery, useCreateCourseMutation, useRegisterCourseMutation } = courseApi