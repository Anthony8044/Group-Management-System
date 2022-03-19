import { api } from "./api"


export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (body) => {
                return {
                    url: "/auth/login",
                    method: "POST",
                    body,
                }
            }
        }),
        registerStudent: build.mutation({
            query: (body) => {
                return {
                    url: "/auth/registerStudent",
                    method: "POST",
                    body,
                }
            }
        }),
        registerTeacher: build.mutation({
            query: (body) => {
                return {
                    url: "/auth/registerTeacher",
                    method: "POST",
                    body,
                }
            }
        }),
    }),
})

export const { useLoginMutation, useRegisterStudentMutation, useRegisterTeacherMutation } = authApi