import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";
import { AppError } from "../../utils/AppError";

export const register = async (req: Request, res: Response) => {
  const parsedData = registerSchema.safeParse(req.body);

  if (!parsedData.success) {
    throw new AppError(parsedData.error.message, 400);
  }

  const newUser = await registerUser(parsedData.data);
  res.status(201).json(newUser);
};

export const login = async (req: Request, res: Response) => {
  const parsedData = loginSchema.safeParse(req.body);

  if (!parsedData.success) {
    throw new AppError(parsedData.error.message, 400);
  }

  const { email, password } = parsedData.data;
  const { token, user } = await loginUser(email, password);
  res.status(200).json({ token, user });
};
