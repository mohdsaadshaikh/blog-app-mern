const Input = ({
  type = "text",
  label,
  register,
  error,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label className="block text-md font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`${className} ${
          error ? "border-red-500" : "focus:gray-orange-500"
        } px-3 py-2 border rounded focus:border-black `}
        {...register}
        {...props}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;
