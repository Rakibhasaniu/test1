import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pickFunction from "../../../shared/pickFunction";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions, userFilterAbleFields } from "../../constant";
import { UserServices } from "./user.services";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filtersField = pickFunction(req?.query, userFilterAbleFields);
  const options = pickFunction(req?.query, filterOptions);
  const token = req.headers.authorization || "";

  const result = await UserServices.getAllUsersFromDB(
    filtersField,
    options,
    token
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getMyProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers?.authorization || "";
  const result = await UserServices.getMyProfileInfoFromDB(token);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile info retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await UserServices.updateUserIntoDB(token, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const getMetaData = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers?.authorization || "";

  const result = await UserServices.getMetaDataFromDB(token);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Meta Data retrieved successfully",
    data: result,
  });
});

const updateUserRoleOrStatus = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers?.authorization || "";
    const id = req.params?.id;
    const payload = req.body;
    const result = await UserServices.updateUserRoleOrStatus(
      token,
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: result,
    });
  }
);

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers?.authorization || "";
  const id = req.params?.id;
  const result = await UserServices.deleteUserFromDB(token, id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  getMetaData,
  getMyProfileInfo,
  updateUserRoleOrStatus,
  deleteUser,
};
