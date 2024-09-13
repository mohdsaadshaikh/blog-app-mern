import jwt from "jsonwebtoken";

const generateToken = (field, type, expiresIn) => {
  const payload = { field, type };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
