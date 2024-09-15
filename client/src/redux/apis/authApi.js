import { apis } from "./baseApi";
import { onQueryStarted } from "../../lib/handleApiErr";

export const authApis = apis.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: `user/me`,
      }),
      onQueryStarted,
      providesTags: ["User", "Auth"],
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `auth/register`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `auth/login`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: `auth/logout`,
        method: "GET",
      }),
      onQueryStarted,
      providesTags: ["User", "Auth"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: `auth/reset-password?token=${token}`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `user/updateMe`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `auth/updatepassword`,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),
    creatorRequest: builder.mutation({
      query: (data) => ({
        url: `user//promote-to-creator`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["User", "Auth"],
    }),
    getRandomUserProfile: builder.query({
      query: (userId) => ({
        url: `user/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useCreatorRequestMutation,
  useGetRandomUserProfileQuery,
} = authApis;
