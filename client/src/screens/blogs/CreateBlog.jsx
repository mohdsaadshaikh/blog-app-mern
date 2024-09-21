import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "../../redux/apis/blogApi";
import TextEditor from "../../Components/TextEditor";
import { useForm } from "react-hook-form";
import Input from "../../Components/Input";
import { MultiSelect } from "primereact/multiselect";
import { BLOG_TAGS } from "../../utils/blogTags";
import { FileUpload } from "primereact/fileupload";

const CreateBlog = () => {
  const currentUser = useSelector((state) => state.Authentication.userData);
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const handleImageUpload = useCallback((file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const imageUrl = event.target.result;
  //       setImages((prevImages) => [...prevImages, imageUrl]);
  //       resolve(imageUrl);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }, []);

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

      // images.forEach((image, index) => {
      //   formData.append("images", image);
      // });

      const response = await createBlog(formData).unwrap();
      console.log(response);
      toast.success("Blog created successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
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

  const tags = BLOG_TAGS.map((tag) => ({ name: tag }));

  const onCoverImgSelect = (e) => {
    setCoverImage(e.files[0]);
  };

  return (
    <>
      {currentUser?.role === "Admin" || currentUser?.role === "Creator" ? (
        <div className="w-[100vw] mt-4 min-h-screen flex justify-center">
          <div className="max-w-screen-lg  border-2 rounded-md p-6">
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
                      label: "Upload Cover Image",
                      icon: "pi pi-fw pi-images",
                    }}
                  />
                </div>
                {/* {errors?.coverImage?.message && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors?.coverImage?.message}
                  </span>
                )} */}
              </div>
              <div className="flex flex-col">
                <label className="block text-md font-medium mb-1 leading-6 text-gray-900">
                  Select Tags
                </label>
                <div className="card flex justify-content-center">
                  <MultiSelect
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.value)}
                    options={tags}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select Tags"
                    maxSelectedLabels={3}
                    className="w-full border py-1 focus:ring-black"
                  />
                </div>
                {/* Checking if `errors.tags` exists */}
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
                  <TextEditor
                    content={content}
                    setContent={setContent}
                    // handleImageUpload={handleImageUpload}
                    // images={images}
                  />
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
                Publish
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

export default CreateBlog;
