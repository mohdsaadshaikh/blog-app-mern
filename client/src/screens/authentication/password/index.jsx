import { useForm } from "react-hook-form";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../../redux/apis/authApi";
import Input from "../../../Components/Input";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import PasswordInput from "../../../Components/PasswordInput";

export const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      toast.error(
        error?.data?.message || "Error sending password reset email."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            register={register("email", {
              required: "Email is required",
            })}
            error={errors.email?.message}
            className="border-gray-500 w-full"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-black transition"
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);

  const onSubmit = async (data) => {
    try {
      await resetPassword({ data, token }).unwrap();
      toast.success("Password reset successful!");
      navigate("/auth");
    } catch (error) {
      toast.error(error?.data?.message || "Error resetting password.");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PasswordInput
            placeholder="Enter new password"
            name="password"
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password?.message}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-2 px-4 mt-3 rounded hover:bg-black transition"
          >
            {isLoading ? "Sending..." : "Reset"}
          </button>
        </form>
      </div>
    </div>
  );
};
