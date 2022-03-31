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
        getStudentGroups: build.query({
            query: ({ id }) => {
                return {
                    url: `/student/getStudentGroups/${id}`,
                }
            },
            providesTags: ['Project'],
        }),
        getStudentInvite: build.query({
            query: (id) => {
                return {
                    url: `/group/getStudentInvite/${id}`,
                }
            },
            providesTags: ['Project'],
        }),
        invite: build.mutation({
            query: (body) => {
                return {
                    url: "/group/invite",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Project'],
        }),
        acceptInvite: build.mutation({
            query: (body) => {
                return {
                    url: "/group/acceptInvite",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Project'],
        }),
        rejectInvite: build.mutation({
            query: (body) => {
                return {
                    url: "/group/rejectInvite",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ['Project'],
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

export const { useGetAllProjectsQuery, useCreateprojectMutation, useGetProjectsByCourseIdQuery, useJoinGroupMutation, useLeaveGroupMutation, useGetStudentGroupsQuery, useGetStudentInviteQuery, useInviteMutation, useAcceptInviteMutation, useRejectInviteMutation } = projectApi