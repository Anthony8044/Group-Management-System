import { api } from "./api"


export const projectApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllProjects: build.query({
            query: () => {
                return {
                    url: "/project/getAllProjects",
                }
            },
            providesTags: ['Project'],
        }),
        getProjectsByCourseId: build.query({
            query: (id) => {
                return {
                    url: `/project/getProjectsByCourseId/${id}`,
                }
            },
            providesTags: ['Project'],
        }),
        createproject: build.mutation({
            query: (body) => {
                return {
                    url: "/project/createproject",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Project'],
        }),
        joinGroup: build.mutation({
            query: (body) => {
                return {
                    url: "/group/joinGroup",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Project'],
        }),
        leaveGroup: build.mutation({
            query: (body) => {
                return {
                    url: "/group/leaveGroup",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Project'],
        }),
    }),
})

export const { useGetAllProjectsQuery, useCreateprojectMutation, useGetProjectsByCourseIdQuery, useJoinGroupMutation, useLeaveGroupMutation } = projectApi