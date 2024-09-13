import { useState } from "react";

const PasswordInput = ({ register, error, label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="">
      <label className="block text-md font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full rounded py-2 px-4 text-gray-900 border ${
            error ? "border-red-500" : "border-gray-500"
          } shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6`}
          {...register}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <i className="pi pi-eye-slash" />
          ) : (
            <i className="pi pi-eye" />
          )}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordInput;
