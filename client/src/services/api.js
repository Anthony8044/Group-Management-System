import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://group-management-system-gms.herokuapp.com',
  }),
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: ['Student', 'Teacher', 'Course', 'Project'],
})