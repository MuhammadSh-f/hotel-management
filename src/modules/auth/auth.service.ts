import bcrypt from "bcryptjs";
import { User, IUser } from "../users/user.model";
import { generateToken } from "../../utils/generateToken";
import { AppError } from "../../utils/AppError";

/**
 * Register a new user.
 * Returns the created user object (without the password) and a JWT token.
 */
export const registerUser = async (data: Partial<IUser>) => {
  // ----- Validate required fields -------------------------------------------------
  if (!data.email) {
    throw new AppError("Please provide your email address", 400);
  }

  if (!data.password) {
    throw new AppError("Please provide a password", 400);
  }

  // ----- Check for existing account -----------------------------------------------
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  // ----- Create the user -----------------------------------------------------------
  const hashedPassword = await bcrypt.hash(data.password!, 10);
  const newUser = await User.create({
    ...data,
    password: hashedPassword,
    role: data.role || "staff",
  });

  // Remove password before returning
  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

/**
 * Authenticate a user and return user data + JWT token.
 */
export const loginUser = async (email: string, password: string) => {
  // ----- Find the user -----------------------------------------------------------
  const user = await User.findOne({ email });
  if (!user)
    throw new AppError("No account found with this email address", 404);

  // ----- Verify password ---------------------------------------------------------
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new AppError("The password you entered is incorrect", 401);

  // ----- Generate JWT ------------------------------------------------------------
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  // Remove password before returning
  const { password: _pwd, ...userWithoutPassword } = user.toObject();
  return { user: userWithoutPassword, token };
};
