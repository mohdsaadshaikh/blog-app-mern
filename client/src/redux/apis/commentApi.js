import { apis } from "./baseApi";
import { onQueryStarted } from "../../lib/handleApiErr";

export const commentApis = apis.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `blogs/${blogId}/comments`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Comment"],
    }),
    updateComment: builder.mutation({
      query: ({ blogId, commentId, data }) => ({
        url: `blogs/${blogId}/comments/${commentId}`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Comment"],
    }),
    deleteComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `blogs/${blogId}/comments/${commentId}`,
        method: "DELETE",
      }),
      onQueryStarted,
      invalidatesTags: ["Comment"],
    }),
    likeComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `blogs/${blogId}/comments/${commentId}/react`,
        method: "PATCH",
      }),
      onQueryStarted,
      invalidatesTags: ["Comment"],
    }),
    replyComment: builder.mutation({
      query: ({ blogId, commentId, data }) => ({
        url: `blogs/${blogId}/comments/${commentId}/reply`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useReplyCommentMutation,
} = commentApis;
