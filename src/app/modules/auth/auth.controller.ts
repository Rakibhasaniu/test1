import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.services";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  res.cookie("refreshToken", result?.refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: result?.user,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const  refreshToken = req.cookies?.refreshToken;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Token generated successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AuthServices.changePassword(req?.user, req?.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
      data: result,
    });
  }
);

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
};
