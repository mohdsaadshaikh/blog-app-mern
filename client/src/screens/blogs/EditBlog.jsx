import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "../../redux/apis/blogApi";
import TextEditor from "../../Components/TextEditor";
import { useForm } from "react-hook-form";
import Input from "../../Components/Input";
import { MultiSelect } from "primereact/multiselect";
import { BLOG_TAGS } from "../../utils/blogTags";
import { FileUpload } from "primereact/fileupload";

const EditBlog = () => {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.Authentication.userData);
  const { data: blog } = useGetBlogByIdQuery(id);
  console.log(blog);

  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (blog) {
      setValue("title", blog?.data?.title);
      setContent(blog?.data?.content);
      setSelectedTag(blog?.data?.tags?.map((tag) => ({ name: tag })));
    }
  }, [blog, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      const tagsArray = selectedTag.map((tag) => tag.name);

      tagsArray.forEach((tag) => {
        formData.append("tags", tag);
      });

      formData.append("content", content);

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      //   for (let pair of formData.entries()) {
      //     console.log(pair[0], pair[1]);
      //   }

      const res = await updateBlog({ id, body: formData }).unwrap();
      console.log(res);
      toast.success("Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  const onCoverImgSelect = (e) => {
    setCoverImage(e.files[0]);
  };

  return (
    <>
      {currentUser?.role === "Admin" || currentUser?.role === "Creator" ? (
        <div className="w-[100vw] mt-4 min-h-screen flex justify-center">
          <div className="max-w-screen-lg border-2 rounded-md p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder="Title"
                label="Title"
                register={register("title", { required: "Title is required" })}
                error={errors.title?.message}
                className="py-3"
              />
              <div>
                <label className="block text-md font-medium leading-6 mb-1 text-gray-900">
                  Cover Image
                </label>
                <div className="file-upload-container">
                  <FileUpload
                    mode="basic"
                    accept="image/*"
                    className="custom-file-upload"
                    onSelect={onCoverImgSelect}
                    auto={false}
                    chooseOptions={{
                      label: coverImage
                        ? "Change Cover Image"
                        : "Upload Cover Image",
                      icon: "pi pi-fw pi-images",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-md font-medium mb-1 leading-6 text-gray-900">
                  Select Tags
                </label>
                <div className="card flex justify-content-center">
                  <MultiSelect
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.value)}
                    options={BLOG_TAGS.map((tag) => ({ name: tag }))}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select Tags"
                    maxSelectedLabels={3}
                    className="w-full border py-1 focus:ring-black"
                  />
                </div>
                {errors?.tags && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.tags.message}
                  </span>
                )}
              </div>

              <div className="my-5">
                <label className="block text-md font-medium mb-1 leading-6 text-gray-900">
                  Content
                </label>
                <div className="max-h-60 h-60">
                  <TextEditor content={content} setContent={setContent} />
                </div>
                {errors && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors?.content?.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`w-full bg-gray-800 text-white mt-10 py-2 px-4 rounded hover:bg-black transition-all duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Update
              </button>
            </form>
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

export default EditBlog;
