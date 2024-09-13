/* eslint-disable */
import { Avatar } from "primereact/avatar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./Avatar";

const BlogCard = ({ blog }) => {
  const { title, content, author, views, coverImage, createdAt, likes } = blog;

  const navigate = useNavigate();

  const handleViewBlog = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div
      className="flex flex-row justify-between select-none items-center py-2 border-b cursor-default w-[700px] max-sm:w-full md-px-2 my-2"
      onClick={handleViewBlog}
    >
      <div className="flex flex-col justify-between h-full w-4/6 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-[25px] h-[25px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            <UserAvatar
              image={author?.avatar?.url}
              name={author?.name}
              avatarSize="w-full h-full"
              spanSize="text-base"
            />
          </div>

          <span className="text-gray-700 hover:underline cursor-pointer text-[13px]">
            {author?.name}
          </span>
        </div>
        <h2 className="text-2xl max-md:text-base hover:text-gray-800 cursor-pointer font-blog-title font-bold text-black">
          {title}
        </h2>
        <p className="text-gray-700 max-xl:text-[15px] max-md:text-[13px] max-sm:text-[12px] ">
          {content.substring(0, 45)}{" "}
          <span className="text-purple-900 underline cursor-pointer hover:text-purple-950">
            Read more
          </span>
        </p>
        <div className="flex items-center gap-4 text-[13px] pt-3 text-gray-800">
          <span>{format(new Date(createdAt), "dd MMM yyyy")}</span>
          <div className="flex items-center gap-1">
            <i className="pi pi-eye text-sm"></i>
            <span>{views}</span>
          </div>
          <div className="">
            <i
              className={`${
                likes?.length > 0 ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up"
              } text-sm m-1`}
            ></i>
            <span>{likes?.length}</span>
          </div>
        </div>
      </div>
      <div className="w-1/4 h-full flex items-center bg-cover bg-center rounded-lg ml-4">
        <img
          src={coverImage?.url}
          alt={title}
          className="w-full h-full object-cover "
        />
      </div>
    </div>
  );
};

export default BlogCard;
