import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  credentials: "include",
});

export const apis = createApi({
  reducerPath: "apis",
  baseQuery,
  tagTypes: ["Auth", "Blog", "Comment","User"],
  endpoints: () => ({}),
});
