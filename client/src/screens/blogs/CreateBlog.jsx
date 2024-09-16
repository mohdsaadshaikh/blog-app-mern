import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "../../redux/apis/blogApi";
import TextEditor from "../../Components/TextEditor";
import { useForm } from "react-hook-form";
import Input from "../../Components/Input";

const CreateBlog = () => {
  const currentUser = useSelector((state) => state.Authentication.userData);
  const [content, setContent] = useState("");

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createBlog(data).unwrap();
      toast.success("Blog created successfully!");
      navigate("/blogs");
    } catch (error) {
      toast.error("Failed to create blog. Please try again.");
    }
  };

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
        <div className="w-[100vw] mt-4 min-h-screen flex justify-center">
          <div className="max-w-screen-lg flex flex-col gap-4 border-2 rounded-md p-6">
            <TextEditor />
          </div>
        </div>
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
