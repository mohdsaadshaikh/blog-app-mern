import { useHandleCreatorRequestMutation } from "../../redux/apis/authApi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RoleRequestHandle = () => {
  const [handleCreatorRequest, { isLoading }] =
    useHandleCreatorRequestMutation();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleRequest = async (status) => {
    try {
      await handleCreatorRequest({ id, status }).unwrap();
      toast.success(`Request ${status}`);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
        `Failed to ${status} the request: ${error.message || "Unknown error"}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-10">
      <div className="flex gap-2">
        <button
          onClick={() => handleRequest("rejected")}
          className="bg-black hover:bg-white border-2 border-black text-white transition-all hover:text-black py-2 px-4 rounded"
          disabled={isLoading}
        >
          Reject
        </button>
        <button
          onClick={() => handleRequest("approved")}
          className="bg-gray-50 border-black border-2 hover:bg-black hover:text-white transition-all text-black py-2 px-4 rounded mr-2"
          disabled={isLoading}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default RoleRequestHandle;
