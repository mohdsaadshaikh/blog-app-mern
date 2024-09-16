import { useNavigate } from "react-router-dom";
import { useUpdatePasswordMutation } from "../../../redux/apis/authApi";
import { toast } from "react-toastify";
import PasswordInput from "../../../Components/PasswordInput";
import { useForm } from "react-hook-form";

const ChangePassword = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await updatePassword(data).unwrap();
      toast.success("Password updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="min-h-screen flex mt-12 justify-center ">
      <div className="bg-white p-10 h-3/5 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Change Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <PasswordInput
              label="Current Password"
              register={register("currentPassword", {
                required: "Current password is required",
              })}
              error={errors.currentPassword?.message}
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              label="New Password"
              register={register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.newPassword?.message}
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              label="Confirm New Password"
              register={register("confirmPassword", {
                required: "Please confirm your new password",
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button
              type="button"
              className="w-1/3 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-all duration-300"
              onClick={() => navigate("/profile/settings")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-1/3 bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
