import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./layout";
import { lazy, Suspense, useEffect } from "react";
import { setAuthenticated } from "./redux/slices/authentication";
import { useGetUserProfileQuery } from "./redux/apis/authApi";
import Spinner from "../src/Components/Spinner";
import NProgress from "nprogress";
import Profile from "./screens/profile";
import Settings from "./screens/profile/Settings";
import Home from "./screens/home/home";
import Blog from "./screens/blogs/Blog";
import BlogDetail from "./screens/blogs/BlogDetail";
import CreateBlog from "./screens/blogs/CreateBlog";
import CreatorRequest from "./screens/authentication/CreatorRequest";
import {
  ForgotPassword,
  ResetPassword,
} from "./screens/authentication/password/index";
import ChangePassword from "./screens/authentication/password/ChangePassword";
import RoleRequestHandle from "./screens/authentication/RoleRequestHandle";
import DeleteMe from "./screens/profile/DeleteMe";
import EditBlog from "./screens/blogs/EditBlog";

const Auth = lazy(() => import("./screens/authentication/Auth"));
const ErrorPage = lazy(() => import("./Components/ErrorPage"));

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.Authentication);
  const { data, isLoading, isSuccess, isFetching } = useGetUserProfileQuery();

  const isSomeQueryPending = useSelector(
    (state) =>
      Object.values(state.apis.queries).some(
        (query) => query.status === "pending"
      ) ||
      Object.values(state.apis.mutations).some(
        (query) => query.status === "pending"
      )
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuthenticated({ userData: data?.data }));
    }
  }, [isFetching, dispatch, data?.data, isSuccess]);

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  if (isLoading) {
    return;
  }

  return (
    <>
      {isSomeQueryPending && <Spinner />}
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route path="/blogs" element={<Blog />} />
              </>
            ) : (
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Blog />} />
                <Route path="/write" element={<CreateBlog />} />
                <Route path="/:id/edit" element={<EditBlog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/profile/settings" element={<Settings />} />
                <Route path="/profile/delete-account" element={<DeleteMe />} />
                <Route path="/creator-request" element={<CreatorRequest />} />
                <Route
                  path="/handle-request/:id"
                  element={<RoleRequestHandle />}
                />
                <Route path="/change-password" element={<ChangePassword />} />
              </Route>
            )}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
