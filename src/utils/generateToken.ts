import jwt from "jsonwebtoken";

export const generateToken = (payLoad: object) => {
  return jwt.sign(payLoad, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
