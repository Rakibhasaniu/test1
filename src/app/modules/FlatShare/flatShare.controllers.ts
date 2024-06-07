import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pickFunction from "../../../shared/pickFunction";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions, flatFilterAbleFields } from "../../constant";
import { TRequestOnMyPost } from "../../interfaces/common";
import { FlatShareServices } from "./flatShare.services";

const flatShareRequest = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await FlatShareServices.flatShareRequestIntoDB(
    req.body,
    token
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Flat Share request submitted successfully",
    data: result,
  });
});

const getAllFlatShareRequests = catchAsync(
  async (req: Request, res: Response) => {
    const filtersField = pickFunction(req?.query, ["status"]);
    const options = pickFunction(req?.query, filterOptions);
    const token = req.headers.authorization || "";

    const result = await FlatShareServices.getAllFlatShareRequestsFromDB(
      filtersField,
      options,
      token
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Flat Share requests retrieved successfully",
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      data: result.data,
    });
  }
);

const getMyFlatShareRequests = catchAsync(
  async (req: Request, res: Response) => {
    const filtersField = pickFunction(req?.query, ["status"]);
    const options = pickFunction(req?.query, filterOptions);
    const token = req.headers.authorization || "";

    const result = await FlatShareServices.getMyFlatShareRequestsFromDB(
      filtersField,
      options,
      token
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My flat share requests retrieved successfully",
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      data: result.data,
    });
  }
);

const getAllRequestsOnMyFlatPost = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    const data: TRequestOnMyPost[] = [];
    const result: any =
      await FlatShareServices.getAllRequestsOnMyFlatPostFromDB(token);

    if (result && result[0]?.id) {
      result.map((item: TRequestOnMyPost) => {
        if (item?.requests?.length) {
          data.push(item);
        }
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: data.length
        ? "Request on my flats retrieved successfully"
        : "No request on your flats",
      data,
    });
  }
);

const updateFlatShareRequest = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";
    const flatShareId  = req.params?.flatShareId;

    const result = await FlatShareServices.updateFlatShareRequestIntoDB(
      flatShareId,
      req.body,
      token
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Flat Share request updated successfully",
      data: result,
    });
  }
);

const deleteFlatShareRequest = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";
    const { flatShareId } = req.params;

    const result = await FlatShareServices.deleteFlatShareRequestFromDB(
      token,
      flatShareId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Flat share request deleted successfully",
      data: result,
    });
  }
);

export const FlatShareControllers = {
  flatShareRequest,
  getAllFlatShareRequests,
  getMyFlatShareRequests,
  getAllRequestsOnMyFlatPost,
  updateFlatShareRequest,
  deleteFlatShareRequest,
};
