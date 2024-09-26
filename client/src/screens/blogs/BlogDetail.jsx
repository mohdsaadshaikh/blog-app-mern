import { Link, useParams } from "react-router-dom";
import {
  useGetAuthorBlogsQuery,
  useGetBlogByIdQuery,
  useReactToblogMutation,
} from "../../redux/apis/blogApi";
import { estimateReadingTime } from "../../utils/readingTime";
import { format } from "date-fns";
import Comment from "../comments";
import { useEffect, useState } from "react";
import UserAvatar from "../../Components/Avatar";
import parse from "html-react-parser";
import { useDebouncedCallback } from "use-debounce";
import { useSelector } from "react-redux";

const BlogDetail = () => {
  const { id } = useParams();
  const { data, refetch } = useGetBlogByIdQuery(id);
  const { data: moreBlogs } = useGetAuthorBlogsQuery(id);
  const blog = data?.data;

  const { _id } = useSelector((state) => state.Authentication?.userData);

  const [visibleRight, setVisibleRight] = useState(false);

  const [reactToBlog] = useReactToblogMutation();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(0);

  useEffect(() => {
    if (data) {
      setIsLiked(data.data.likes.includes(_id));
      setIsDisliked(data.data.dislikes.includes(_id));
      setLikesCount(data.data.likes.length);
      setDislikesCount(data.data.dislikes.length);
    }
  }, [data, _id]);

  const handleReaction = useDebouncedCallback(
    async (reactionType) => {
      try {
        const response = await reactToBlog({
          blogId: id,
          reaction: reactionType,
        }).unwrap();

        setIsLiked(response.isLiked);
        setIsDisliked(response.isDisliked);

        setLikesCount(response?.likes?.length);
        setDislikesCount(response?.dislikes?.length);
      } catch (error) {
        console.error("Failed to react to the blog:", error);
      }
    },
    500,
    { leading: true, trailing: false }
  );

  const readingTime = blog?.content ? estimateReadingTime(blog.content) : 0;

  return (
    <div className="my-8 ml-4 mr-8">
      <div className="min-h-[100vh] w-full flex flex-col gap-4 xl:w-[50%] lg:w-[60%] md:w-[90%] mx-auto ">
        <h1 className="text-5xl max-md:text-3xl font-blog-title font-bold text-black">
          {blog?.title}
        </h1>
        <div className="flex items-center space-x-2 my-4">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            <UserAvatar
              image={blog?.author?.avatar?.url}
              name={blog?.name}
              avatarSize="w-full h-full"
              spanSize="text-base"
            />
          </div>
          <div className="flex flex-col">
            <Link to={`/profile/${blog?.author?._id}`}>
              <span className="text-black hover:underline cursor-pointer text-[15px]">
                {blog?.author?.name}
              </span>
            </Link>
            <div className="flex gap-4">
              <span className="text-gray-600 text-[13px]">
                {readingTime} min
                {readingTime > 1 ? "s" : ""} read
              </span>
              <span className="text-gray-800 text-[13px]">
                {blog?.createdAt
                  ? format(new Date(blog.createdAt), "MMM dd, yyyy")
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <img src={blog?.coverImage?.url} alt="dd" className="w-full" />
        <div className="flex border-y justify-between px-3 border-gray-200 py-3 text-gray-500">
          <div className="flex gap-5 text-black">
            <div
              title="Like"
              className="cursor-pointer space-x-1"
              onClick={() => handleReaction("like")}
            >
              <i
                className={`pi ${
                  isLiked ? "pi-thumbs-up-fill" : "pi-thumbs-up"
                }`}
              ></i>
              <span>{likesCount}</span>
            </div>
            <div
              title="Dislike"
              className="cursor-pointer space-x-1"
              onClick={() => handleReaction("dislike")}
            >
              <i
                className={`pi ${
                  isDisliked ? "pi-thumbs-down-fill" : "pi-thumbs-down"
                }`}
              ></i>
              <span>{dislikesCount}</span>
            </div>
          </div>
          <div className="space-x-1">
            <div
              title="Comments"
              className="cursor-pointer space-x-1"
              onClick={() => setVisibleRight(true)}
            >
              <i className="pi pi-comment"></i>
              <span>
                {blog?.comments?.length +
                  blog?.comments?.reduce(
                    (total, comment) => total + (comment.replies?.length || 0),
                    0
                  ) || 0}
              </span>
            </div>
            <Comment
              visibleRight={visibleRight}
              setVisibleRight={setVisibleRight}
              data={blog?.comments}
              blogId={blog?._id}
              refetch={refetch}
            />
          </div>
        </div>
        <p className="text-gray-800 text-lg font-blog-content font-medium mt-4">
          {parse(blog?.content || "")}
        </p>
        <div className="">
          {blog?.tags?.map((tag, i) => {
            return (
              <span
                key={i}
                className="text-gray-600 text-[12px] mr-2 cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                {tag}
              </span>
            );
          })}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            More from {blog?.author?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moreBlogs?.data?.map((moreBlog) => (
              <Link key={moreBlog._id} to={`/blog/${moreBlog._id}`}>
                <div className="border p-4 rounded-lg cursor-pointer">
                  <img
                    src={moreBlog.coverImage?.url}
                    alt={moreBlog.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{moreBlog.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {format(new Date(moreBlog.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {estimateReadingTime(moreBlog.content)} mins read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
