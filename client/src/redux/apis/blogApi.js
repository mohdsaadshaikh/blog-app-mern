import { apis } from "./baseApi";
import { onQueryStarted } from "../../lib/handleApiErr";

export const blogApis = apis.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (params) => ({
        url: `blogs`,
        params: params,
      }),
      onQueryStarted,
      providesTags: ["Blogs"],
    }),
    getBlogById: builder.query({
      query: (id) => ({
        url: `blogs/${id}`,
      }),
      onQueryStarted,
      providesTags: ["Blogs"],
    }),
    createBlog: builder.mutation({
      query: (data) => ({
        url: `blogs`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Blogs"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `blogs/${id}`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Blogs"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "DELETE",
      }),
      onQueryStarted,
      invalidatesTags: ["Blogs"],
    }),
    getAuthorBlogs: builder.query({
      query: (blogId) => ({
        url: `blogs/${blogId}/more`,
      }),
      onQueryStarted,
      providesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetAuthorBlogsQuery,
} = blogApis;
