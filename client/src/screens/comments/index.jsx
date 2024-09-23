import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CommentBox from "../../Components/CommentBox";
import { useCreateCommentMutation } from "../../redux/apis/commentApi";

const Comment = ({ visibleRight, setVisibleRight, data, blogId, refetch }) => {
  const [loading, setLoading] = useState(false);

  const [createComment] = useCreateCommentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (commentData) => {
    try {
      setLoading(true);
      await createComment({
        blogId,
        data: commentData,
      }).unwrap();
      toast.success("Comment added successfully!");

      await refetch();

      reset();
      setVisibleRight(false);
    } catch (error) {
      toast.error("Failed to add comment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar
      visible={visibleRight}
      position="right"
      onHide={() => setVisibleRight(false)}
      style={{ width: "400px" }}
    >
      <div className="px-2 flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="border border-gray-300 rounded p-2">
            <textarea
              {...register("comment", { required: true })}
              className="w-full h-16 resize-none outline-none"
              placeholder="Type your comment here..."
            />
            <div className="flex justify-end gap-2 mt-2 px-2 py-1">
              <button
                type="button"
                onClick={() => setVisibleRight(false)}
                className="hover:bg-gray-50 text-black text-sm py-1 px-3 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gray-800 hover:bg-black transition-all text-sm text-white  py-1 px-3 rounded"
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
          {errors.comment && (
            <p className="text-red-500 text-sm">Comment is required.</p>
          )}
        </form>
        <div className="overflow-auto">
          {data?.map((comment) => (
            <CommentBox
              key={comment._id}
              blogId={blogId}
              commentsData={comment}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default Comment;
