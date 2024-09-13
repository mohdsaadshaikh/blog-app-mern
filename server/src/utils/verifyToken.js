import jwt from "jsonwebtoken";
import { promisify } from "util";
import {
  PasswordResetToken,
  VerificationToken,
} from "../models/token.model.js";

const verifyToken = async (token, tokenType) => {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let TokenModel;
    switch (tokenType) {
      case "EmailVerificationToken":
        TokenModel = VerificationToken;
        break;
      case "PasswordResetToken":
        TokenModel = PasswordResetToken;
        break;
      default:
        return null;
    }

    // const storedToken = await TokenModel.findOne({ token });
    const storedToken = await TokenModel.findOne({
      token,
      expires: { $gt: new Date() },
    });

    // const tokenExpires = new Date(storedToken.expires) < new Date();

    if (!storedToken) {
      return null;
    }

    // if (tokenExpires ||decoded.type !== tokenType) {
    if (decoded.type !== tokenType) {
      return null;
    }

    return storedToken;
  } catch (error) {
    return null;
  }
};

export default verifyToken;
