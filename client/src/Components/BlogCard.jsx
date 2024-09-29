/* eslint-disable */
import { format } from "date-fns";
import parse from "html-react-parser";
import { OverlayPanel } from "primereact/overlaypanel";
import { SplitButton } from "primereact/splitbutton";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteBlogMutation } from "../redux/apis/blogApi";
import UserAvatar from "./Avatar";

const BlogCard = ({ blog }) => {
  const { title, content, author, viewedBy, coverImage, createdAt, likes } =
    blog;

  const op = useRef(null);
  const navigate = useNavigate();

  const [deleteBlog] = useDeleteBlogMutation();
  const currentUser = useSelector((state) => state.Authentication.userData);

  const handleViewBlog = () => {
    navigate(`/blog/${blog._id}`);
  };

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(blog._id);
      toast.success("Blog deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const items = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        navigate(`/${blog._id}/edit`);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: handleDeleteBlog,
    },
  ];

  return (
    <>
      <div className="flex flex-row justify-between select-none items-center py-2 border-b cursor-default w-[700px] max-sm:w-full md-px-2 my-2">
        <div className="flex flex-col justify-between h-full w-4/6 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-[25px] h-[25px] rounded-full hover:opacity-90 overflow-hidden flex items-center justify-center bg-gray-200">
              <UserAvatar
                image={author?.avatar?.url}
                name={author?.name}
                avatarSize="w-full h-full"
                spanSize="text-base"
              />
            </div>
            <div className="flex justify-between w-full items-center">
              <span
                onMouseEnter={(e) => op.current.toggle(e)}
                className="text-gray-700 hover:underline cursor-pointer text-[13px]"
              >
                {author?.name}
              </span>
              {currentUser?._id === blog?.author?._id && (
                <>
                  <SplitButton dropdownIcon="pi pi-ellipsis-h" model={items} />
                </>
              )}
            </div>
            <OverlayPanel ref={op}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-6">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200 shadow-md">
                    <UserAvatar
                      image={author?.avatar?.url}
                      name={author?.name}
                      avatarSize="w-full h-full"
                      spanSize="text-6xl"
                    />
                  </div>
                  <div className="text-sm text-black flex gap-2">
                    {author?.role === "Admin" ? (
                      <i className="pi pi-user" />
                    ) : (
                      <i className="pi pi-user-edit" />
                    )}
                    <span>{author?.role}</span>
                  </div>
                </div>
                <Link to={`/profile/${author?._id}`}>
                  <h4 className="text-lg text-black hover:underline cursor-pointer">
                    {author?.name}
                  </h4>
                </Link>
                <p className="text-sm">{author?.bio}</p>
              </div>
            </OverlayPanel>
          </div>
          <h2
            onClick={handleViewBlog}
            className="text-2xl max-md:text-base hover:underline cursor-pointer font-blog-title font-bold text-black"
          >
            {title}
          </h2>
          <p className="text-gray-700 max-xl:text-[15px] max-md:text-[13px] max-sm:text-[12px]">
            {parse(content?.substring(0, 45))}{" "}
            <span
              className="text-purple-900 underline cursor-pointer hover:text-purple-950"
              onClick={handleViewBlog}
            >
              Read more
            </span>
          </p>
          <div className="flex items-center gap-4 text-[13px] pt-3 text-gray-800">
            <span>{format(new Date(createdAt), "dd MMM yyyy")}</span>
            <div className="flex items-center gap-1">
              <i className="pi pi-eye text-sm"></i>
              <span>{viewedBy?.length}</span>
            </div>
            <div onClick={handleViewBlog}>
              <i className="cursor-pointer pi pi-thumbs-up text-sm m-1"></i>
              <span>{likes?.length}</span>
            </div>
          </div>
        </div>
        <div className="w-1/4 h-full flex items-center bg-cover bg-center rounded-lg ml-4">
          <img
            src={coverImage?.url}
            alt={title}
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 "
            onClick={handleViewBlog}
          />
        </div>
      </div>
    </>
  );
};

export default BlogCard;
