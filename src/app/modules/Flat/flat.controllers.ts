import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pickFunction from "../../../shared/pickFunction";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions, flatFilterAbleFields } from "../../constant";
import { FlatServices } from "./flat.services";

const addFlat = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await FlatServices.addFlatIntoDB(req.body, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Flat Posted successfully",
    data: result,
  });
});

const getAllFlats = catchAsync(async (req: Request, res: Response) => {
  const filtersField = pickFunction(req?.query, flatFilterAbleFields);
  const options = pickFunction(req?.query, filterOptions);

  const result = await FlatServices.getAllFlatsFromDB(filtersField, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flats retrieved successfully",
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
    data: result.data,
  });
});

const getMyAllFlats = catchAsync(async (req: Request, res: Response) => {
  const filtersField = pickFunction(req?.query, flatFilterAbleFields);
  const options = pickFunction(req?.query, filterOptions);
  const token = req.headers.authorization || "";

  const result = await FlatServices.getMyAllFlatsFromDB(
    filtersField,
    options,
    token
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flats retrieved successfully",
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
    data: result.data,
  });
});

const getFlatById = catchAsync(async (req: Request, res: Response) => {
  const result = await FlatServices.getFlatByIdFromDB(req.params?.flatId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat retrieved successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const { flatId } = req.params;
  const token = req.headers.authorization || "";

  const result = await FlatServices.updateFlatIntoDB(req.body, flatId, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat information updated successfully",
    data: result,
  });
});

const deleteFlatImage = catchAsync(async (req: Request, res: Response) => {
  const { flatId } = req.params;
  const imageLink = req.body.imageLink;
  const token = req.headers.authorization || "";

  const result = await FlatServices.deleteFlatImageFromDB(
    flatId,
    imageLink,
    token
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat photo deleted successfully",
    data: result,
  });
});

const deleteFlatPost = catchAsync(async (req: Request, res: Response) => {
  const { flatId } = req.params;
  const token = req.headers.authorization || "";

  const result = await FlatServices.deleteFlatPostFromDB(token, flatId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat post deleted successfully",
    data: result,
  });
});

export const FlatControllers = {
  addFlat,
  getAllFlats,
  getMyAllFlats,
  getFlatById,
  updateFlat,
  deleteFlatImage,
  deleteFlatPost,
};
