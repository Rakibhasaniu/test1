import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import AppError from "../app/errors/AppError";
import config from "../config";
import { jwtHelpers } from "../helper/jwtHelpers";
import prisma from "./prisma";
import { User, UserStatus } from "@prisma/client";

const isUserAuthorized = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const validUser = jwtHelpers.verifyToken(
    token,
    config.jwt.JWT_SECRET as Secret
  );

  if (!validUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const user = (await prisma.user.findUnique({
    where: {
      id: validUser.id,
      status: UserStatus.ACTIVATE,
    },
  })) as User;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  return user;
};

export default isUserAuthorized;
