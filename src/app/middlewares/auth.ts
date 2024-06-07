import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { jwtHelpers } from "../../helper/jwtHelpers";
import config from "../../config";

const auth = (...roles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.JWT_SECRET as Secret
    );

    if (!verifiedUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = verifiedUser;

    if (roles.length && !roles.includes(verifiedUser.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden access!");
    }

    next();
  };
};

export default auth;
