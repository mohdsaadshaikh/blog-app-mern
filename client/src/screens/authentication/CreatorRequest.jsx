import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreatorRequestMutation } from "../../redux/apis/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../Components/Input";

const CreatorRequest = () => {
  const [creatorRequest, { isLoading }] = useCreatorRequestMutation();
  const currentUser = useSelector((state) => state.Authentication.userData);

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await creatorRequest(data).unwrap();
      toast.info(
        "Your request has been sent to the Admin. Please be patient, we will send you an email within 1,2 business days."
      );
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Error creating request.");
    }
  };

  return (
    <>
      {currentUser?.role === "Admin" || currentUser?.role === "Creator" ? (
        <h1 className="text-center text-2xl text-black mt-4 font-bold">
          You are already a Creator or Admin. No need to request access!
        </h1>
      ) : (
        <div className="w-full h-full flex justify-center mt-4">
          <div className=" p-6 w-full max-w-md md:max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col sm:flex-row h-10">
                <div className="sm:w-1/4 pr-2">
                  <Input
                    type="number"
                    register={register("age", { required: "Age is required" })}
                    placeholder="Age"
                    error={errors.age?.message}
                    className="border-gray-500 w-full"
                  />
                </div>

                <div className="sm:w-3/4">
                  <Input
                    type="tel"
                    register={register("phone", {
                      required: "Phone is required",
                    })}
                    placeholder="Enter your phone number"
                    error={errors.phone?.message}
                    className="border-gray-500 w-full"
                  />
                </div>
              </div>

              {/* Address Input */}
              <Input
                type="text"
                register={register("address", {
                  required: "Address is required",
                })}
                placeholder="Enter your address"
                error={errors.address?.message}
                className="border-gray-500 w-full"
              />

              {/* Social Media Links */}
              <Input
                type="url"
                register={register("twitter")}
                placeholder="Enter your Twitter profile URL (optional)"
                className="border-gray-500 w-full"
              />

              <Input
                type="url"
                register={register("github")}
                placeholder="Enter your GitHub profile URL (optional)"
                className="border-gray-500 w-full"
              />

              <Input
                type="url"
                register={register("linkedin")}
                placeholder="Enter your LinkedIn profile URL (optional)"
                className="border-gray-500 w-full"
              />

              <Input
                type="url"
                register={register("instagram")}
                placeholder="Enter your Instagram profile URL (optional)"
                className="border-gray-500 w-full"
              />

              {/* Reason Input */}
              <div>
                <textarea
                  placeholder="Why do you want to become a creator?"
                  {...register("reason", { required: "Reason is required" })}
                  className={`w-full px-3 py-2 border ${
                    errors.reason ? "border-red-500" : "border-gray-500"
                  } rounded focus:outline-none focus:border-black`}
                  rows={3}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-black transition"
                >
                  {isLoading ? "Sending..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatorRequest;
