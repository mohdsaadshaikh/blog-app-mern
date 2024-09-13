const UserAvatar = ({ image, name, className, avatarSize, spanSize }) => {
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <>
      {image ? (
        <img
          src={image}
          alt="Profile"
          className={`select-none object-cover ${avatarSize}`}
          onError={(e) => (e.target.src = "path_to_default_image.png")}
        />
      ) : (
        <span
          className={`select-none text-gray-600 flex items-center justify-center h-full ${spanSize}`}
        >
          {getInitials(name)}
        </span>
      )}
    </>
  );
};

export default UserAvatar;
