import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCreateBlogMutation } from "../../redux/apis/blogApi";

const CreateBlog = () => {
  const currentUser = useSelector((state) => state.Authentication.userData);

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  useEffect(() => {
    if (currentUser?.role !== "Admin" && currentUser?.role !== "Creator") {
      toast.error("Access Denied: You don't have permission to create a blog.");
      // setTimeout(() => {
      toast.info(
        `Want to become a Creator? Submit your request with all the required details.`
      );
      // }, 5000);
    }
  }, [currentUser]);

  return (
    <>
      {currentUser?.role === "Admin" || currentUser?.role === "Creator" ? (
        <div className="w-[100vw] mt-4 h-full"></div>
      ) : (
        <Link to="/creator-request">
          <div className="flex justify-center w-[100vw] mt-4">
            <span className="text-center text-xl underline text-purple-800">
              Submit Creator Request
            </span>
          </div>
        </Link>
      )}
    </>
  );
};

export default CreateBlog;
