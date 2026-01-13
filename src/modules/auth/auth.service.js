import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "./auth.model.js";
import { getAuthConfig } from "../../config/auth.config.js";

export const registerUser = async ({ email, password }) => {
  const authConfig = getAuthConfig();

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(
    password,
    authConfig.bcrypt.saltRounds
  );

  const userId = await createUser({
    email,
    passwordHash,
  });

  return {
    id: userId,
    email,
  };
};

export const loginUser = async ({ email, password }) => {
  const authConfig = getAuthConfig(); // 👈 SECRET BURADA OKUNUR

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};
