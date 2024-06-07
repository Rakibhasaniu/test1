import httpStatus from "http-status";
import config from "../../../config";
import { jwtHelpers } from "../../../helper/jwtHelpers";
import AppError from "../../errors/AppError";
import { Secret } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVATE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your password is invalid");
  }

  const accessToken = jwtHelpers.createToken(
    {
      id: userData.id,
      role: userData.role,
    },
    config.jwt.JWT_SECRET as Secret,
    config.jwt.JWT_EXPIRES_IN as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: userData.id,
      role: userData.role,
    },
    config.jwt.REFRESH_SECRET as Secret,
    config.jwt.REFRESH_EXPIRES_IN as string
  );

  return {
    user: {
      id: userData.id,
      role: userData.role,
      username: userData.username,
      email: userData.email,
      accessToken,
    },
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.REFRESH_SECRET as Secret
    );
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: decodedData?.id,
      status: UserStatus.ACTIVATE,
    },
  });

  const accessToken = jwtHelpers.createToken(
    {
      id: userData?.id,
      username: userData?.username,
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.JWT_SECRET as Secret,
    config.jwt.JWT_EXPIRES_IN as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
      status: UserStatus.ACTIVATE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload?.newPassword, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return {
    message: "Password changed successfully",
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
